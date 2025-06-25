

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."add_purchased_credits"("p_user_id" "uuid", "p_purchase_id" "uuid", "p_credits_amount" integer, "p_description" "text" DEFAULT NULL::"text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  result jsonb;
BEGIN
  -- Add credits to user account
  result := manage_user_credits(
    p_user_id,
    p_credits_amount,
    'purchase',
    p_purchase_id,
    'credit_purchase',
    COALESCE(p_description, format('Purchased %s credits', p_credits_amount)),
    jsonb_build_object('purchase_type', 'one_time', 'credits_amount', p_credits_amount),
    'sandbox'
  );
  
  -- Return true if the operation was successful
  RETURN (result->>'success')::boolean;
END;
$$;


ALTER FUNCTION "public"."add_purchased_credits"("p_user_id" "uuid", "p_purchase_id" "uuid", "p_credits_amount" integer, "p_description" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."consume_reserved_credits"("p_user_id" "uuid", "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$DECLARE
  reserved_amount INTEGER;
  consume_exists BOOLEAN;
BEGIN
  -- Check if already consumed
  SELECT EXISTS(
    SELECT 1 FROM credit_transactions 
    WHERE reference_id = p_book_generation_id 
    AND transaction_type = 'consume'
  ) INTO consume_exists;
  
  IF consume_exists THEN
    RETURN FALSE; -- Already consumed
  END IF;
  
  -- Get reserved amount
  SELECT ABS(amount) INTO reserved_amount
  FROM credit_transactions
  WHERE reference_id = p_book_generation_id
  AND transaction_type = 'reserve'
  AND user_id = p_user_id
  AND environment = p_environment;
  
  IF reserved_amount IS NULL THEN
    RETURN FALSE; -- No reservation found
  END IF;
  
  -- Log consumption (no balance change since already reserved)
  INSERT INTO credit_transactions (
    user_id, transaction_type, amount, balance_before, balance_after,
    reference_id, reference_type, description, metadata,
    environment
  ) VALUES (
    p_user_id, 'consume', -reserved_amount, 
    (SELECT current_balance FROM user_credits WHERE user_id = p_user_id),
    (SELECT current_balance FROM user_credits WHERE user_id = p_user_id),
    p_book_generation_id, 'book_generation', p_description, p_metadata, p_environment
  );
  
  RETURN TRUE;
END;$$;


ALTER FUNCTION "public"."consume_reserved_credits"("p_user_id" "uuid", "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_random_user_id"() RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users LIMIT 1;
  RETURN user_id;
END;
$$;


ALTER FUNCTION "public"."get_random_user_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_credits"("p_user_id" "uuid", "p_environment" "text") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$DECLARE
  credits INTEGER;
BEGIN
  SELECT current_balance INTO credits
  FROM user_credits
  WHERE user_id = p_user_id AND environment = p_environment;
  
  RETURN COALESCE(credits, 0);
END;$$;


ALTER FUNCTION "public"."get_user_credits"("p_user_id" "uuid", "p_environment" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_paddle_webhook"("event" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    user_id uuid;
    customer_id text;
    subscription_id text;
    price_id text;
    status text;
    current_period_start timestamp with time zone;
    current_period_end timestamp with time zone;
BEGIN
    -- Extract user_id, customer_id, subscription_id, and price_id from the event payload
    user_id := (event->'data'->'custom_data'->>'user_id')::uuid; -- Extract user_id from custom_data
    customer_id := event->'data'->>'customer_id'; -- Paddle customer ID
    subscription_id := event->'data'->>'id'; -- Paddle subscription ID
    price_id := event->'data'->'items'->0->'price'->>'id'; -- Paddle price ID
    status := event->'data'->>'status'; -- Subscription status from Paddle

    -- Determine current period start and end based on the event type
    current_period_start := (event->'data'->'current_billing_period'->>'starts_at')::timestamp with time zone;
    current_period_end := (event->'data'->'current_billing_period'->>'ends_at')::timestamp with time zone;

    -- Handle different event types
    CASE event->>'event_type'
        WHEN 'subscription.activated' THEN
            INSERT INTO public.subscriptions (user_id, customer_id, subscription_id, price_id, status, current_period_start, current_period_end)
            VALUES (user_id, customer_id, subscription_id, price_id, 'active', current_period_start, current_period_end)
            ON CONFLICT (subscription_id) DO UPDATE SET 
                status = 'active', 
                current_period_start = current_period_start, 
                current_period_end = current_period_end, 
                updated_at = NOW();

        WHEN 'subscription.canceled' THEN
            UPDATE public.subscriptions
            SET status = 'canceled', canceled_at = NOW()
            WHERE subscription_id = subscription_id;

        WHEN 'subscription.updated' THEN
            UPDATE public.subscriptions
            SET 
                status = status, 
                price_id = price_id, 
                current_period_start = current_period_start, 
                current_period_end = current_period_end, 
                updated_at = NOW()
            WHERE subscription_id = subscription_id;

        WHEN 'subscription.past_due' THEN
            UPDATE public.subscriptions
            SET status = 'past_due', updated_at = NOW()
            WHERE subscription_id = subscription_id;

        WHEN 'subscription.paused' THEN
            UPDATE public.subscriptions
            SET status = 'paused', updated_at = NOW()
            WHERE subscription_id = subscription_id;

        WHEN 'subscription.resumed' THEN
            UPDATE public.subscriptions
            SET status = 'active', updated_at = NOW()
            WHERE subscription_id = subscription_id;

        WHEN 'subscription.trialing' THEN
            UPDATE public.subscriptions
            SET status = 'trialing', current_period_start = current_period_start, current_period_end = current_period_end, updated_at = NOW()
            WHERE subscription_id = subscription_id;

        ELSE
            RAISE NOTICE 'Unhandled event type: %', event->>'event_type';
    END CASE;
END;$$;


ALTER FUNCTION "public"."handle_paddle_webhook"("event" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."manage_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_operation" "text", "p_reference_id" "uuid", "p_reference_type" "text", "p_description" "text" DEFAULT NULL::"text", "p_metadata" "jsonb" DEFAULT NULL::"jsonb", "p_environment" "text" DEFAULT 'sandbox'::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  current_credits integer;
  new_balance integer;
  transaction_type text;
BEGIN
  -- Map operation to transaction type
  transaction_type := CASE p_operation
    WHEN 'purchase' THEN 'earn'
    WHEN 'consume' THEN 'consume'
    WHEN 'refund' THEN 'refund'
    WHEN 'expire' THEN 'expire'
    WHEN 'adjust' THEN 'admin_adjust'
    ELSE 'admin_adjust'
  END;

  -- Get or create user_credits record
  INSERT INTO user_credits (user_id, current_balance, total_earned, total_consumed, environment)
  VALUES (p_user_id, 0, 0, 0, p_environment)
  ON CONFLICT (user_id, environment) DO NOTHING;

  -- Get current balance
  SELECT current_balance INTO current_credits
  FROM user_credits
  WHERE user_id = p_user_id AND environment = p_environment;

  -- Calculate new balance
  new_balance := current_credits + p_amount;

  -- Prevent negative balance except for refunds
  IF new_balance < 0 AND p_operation != 'refund' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient credits',
      'current_balance', current_credits,
      'requested_amount', p_amount
    );
  END IF;

  -- Update user_credits
  UPDATE user_credits
  SET 
    current_balance = new_balance,
    total_earned = CASE WHEN p_amount > 0 THEN total_earned + p_amount ELSE total_earned END,
    total_consumed = CASE WHEN p_amount < 0 THEN total_consumed - p_amount ELSE total_consumed END,
    updated_at = now()
  WHERE user_id = p_user_id AND environment = p_environment;

  -- Record transaction
  INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    reference_id,
    reference_type,
    description,
    metadata,
    environment
  ) VALUES (
    p_user_id,
    transaction_type,
    p_amount,
    current_credits,
    new_balance,
    p_reference_id,
    p_reference_type,
    COALESCE(p_description, CASE 
      WHEN p_operation = 'purchase' THEN format('Purchased %s credits', p_amount)
      WHEN p_operation = 'consume' THEN format('Consumed %s credits', abs(p_amount))
      WHEN p_operation = 'refund' THEN format('Refunded %s credits', p_amount)
      WHEN p_operation = 'expire' THEN format('Expired %s credits', abs(p_amount))
      ELSE format('Adjusted credits by %s', p_amount)
    END),
    COALESCE(p_metadata, jsonb_build_object(
      'operation', p_operation,
      'amount', p_amount
    )),
    p_environment
  );

  RETURN jsonb_build_object(
    'success', true,
    'previous_balance', current_credits,
    'new_balance', new_balance,
    'amount', p_amount,
    'operation', p_operation
  );
END;
$$;


ALTER FUNCTION "public"."manage_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_operation" "text", "p_reference_id" "uuid", "p_reference_type" "text", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refund_reserved_credits"("p_user_id" "uuid", "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$DECLARE
  reserved_amount INTEGER;
  refund_exists BOOLEAN;
  consume_exists BOOLEAN;
BEGIN
  -- Check if already refunded
  SELECT EXISTS(
    SELECT 1 FROM credit_transactions 
    WHERE reference_id = p_book_generation_id 
    AND transaction_type = 'refund'
    AND environment = p_environment
  ) INTO refund_exists;
  
  IF refund_exists THEN
    RETURN FALSE; -- Already refunded
  END IF;
  
  -- Check if already consumed (can't refund consumed credits)
  SELECT EXISTS(
    SELECT 1 FROM credit_transactions 
    WHERE reference_id = p_book_generation_id 
    AND transaction_type = 'consume'
    AND environment = p_environment
  ) INTO consume_exists;
  
  IF consume_exists THEN
    RETURN FALSE; -- Can't refund consumed credits
  END IF;
  
  -- Get reserved amount
  SELECT ABS(amount) INTO reserved_amount
  FROM credit_transactions
  WHERE reference_id = p_book_generation_id
  AND transaction_type = 'reserve'
  AND user_id = p_user_id
  AND environment = p_environment;
  
  IF reserved_amount IS NULL THEN
    RETURN FALSE; -- No reservation found
  END IF;
  
  -- Refund credits (add back to balance)
  RETURN update_user_credits(
    p_user_id,
    reserved_amount,
    'refund',
    p_book_generation_id,
    'book_generation',
    p_description,
    p_metadata,
    p_environment
  );
END;$$;


ALTER FUNCTION "public"."refund_reserved_credits"("p_user_id" "uuid", "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reserve_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$DECLARE
  current_balance INTEGER;
  reservation_exists BOOLEAN;
BEGIN
  -- Check if reservation already exists
  SELECT EXISTS(
    SELECT 1 FROM credit_transactions 
    WHERE reference_id = p_book_generation_id 
    AND transaction_type = 'reserve'
  ) INTO reservation_exists;
  
  IF reservation_exists THEN
    RETURN FALSE; -- Already reserved
  END IF;
  
  -- Get current balance with row lock
  SELECT user_credits.current_balance INTO current_balance
  FROM user_credits
  WHERE user_id = p_user_id AND environment = p_environment
  FOR UPDATE;
  
  -- If user doesn't exist, create record
  IF current_balance IS NULL THEN
    INSERT INTO user_credits (user_id, current_balance, total_earned, total_consumed, environment)
    VALUES (p_user_id, 0, 0, 0, p_environment);
    current_balance := 0;
  END IF;
  
  -- Check if user has enough credits
  IF current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Reserve credits (deduct from balance)
  RETURN update_user_credits(
    p_user_id,
    -p_amount,
    'reserve',
    p_book_generation_id,
    'book_generation',
    p_description,
    p_metadata,
    p_environment
  );
END;$$;


ALTER FUNCTION "public"."reserve_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_operation" "text", "p_reference_id" "uuid", "p_reference_type" "text", "p_description" "text" DEFAULT NULL::"text", "p_metadata" "jsonb" DEFAULT NULL::"jsonb", "p_environment" "text" DEFAULT 'sandbox'::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN manage_user_credits(
    p_user_id,
    p_amount,
    p_operation,
    p_reference_id,
    p_reference_type,
    p_description,
    p_metadata,
    p_environment
  );
END;
$$;


ALTER FUNCTION "public"."update_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_operation" "text", "p_reference_id" "uuid", "p_reference_type" "text", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."annotation_replies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "annotation_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "annotation_replies_content_check" CHECK ((("length"("content") > 0) AND ("length"("content") <= 1000)))
);


ALTER TABLE "public"."annotation_replies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."annotations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chapter_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "start_offset" integer NOT NULL,
    "end_offset" integer NOT NULL,
    "selected_text" "text" NOT NULL,
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "annotations_check" CHECK (("end_offset" >= "start_offset")),
    CONSTRAINT "annotations_content_check" CHECK ((("length"("content") > 0) AND ("length"("content") <= 1000))),
    CONSTRAINT "annotations_selected_text_check" CHECK (("length"("selected_text") > 0)),
    CONSTRAINT "annotations_start_offset_check" CHECK (("start_offset" >= 0)),
    CONSTRAINT "annotations_status_check" CHECK (("status" = ANY (ARRAY['open'::"text", 'resolved'::"text"])))
);


ALTER TABLE "public"."annotations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."book_categories" (
    "book_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL
);


ALTER TABLE "public"."book_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."book_generations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "credits_reserved" integer DEFAULT 0 NOT NULL,
    "credits_consumed" integer DEFAULT 0 NOT NULL,
    "book_title" "text",
    "generation_params" "jsonb",
    "error_message" "text",
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "book_id" "uuid",
    "environment" "text" DEFAULT 'sandbox'::"text" NOT NULL,
    CONSTRAINT "book_generations_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'processing'::"text", 'completed'::"text", 'failed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."book_generations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."books" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "author_name" "text" NOT NULL,
    "isbn" "text",
    "cover_url" "text",
    "synopsis" "text",
    "status" "text" NOT NULL,
    "language_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "narrator_id" "uuid",
    "tone_id" "uuid",
    "literature_style_id" "uuid",
    "team_id" "uuid",
    CONSTRAINT "books_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'writing'::"text", 'reviewing'::"text", 'published'::"text", 'archived'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."books" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_pro" boolean DEFAULT true
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chapter_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chapter_id" "uuid" NOT NULL,
    "content" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."chapter_versions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chapters" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "book_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "order" integer NOT NULL,
    "type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "chapters_type_check" CHECK (("type" = ANY (ARRAY['chapter'::"text", 'page'::"text"])))
);


ALTER TABLE "public"."chapters" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."credit_packages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "price_id" "text" NOT NULL,
    "credits_amount" integer NOT NULL,
    "price_cents" integer NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "discount_percentage" integer DEFAULT 0,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "product_id" "text" NOT NULL,
    "environment" "text" DEFAULT 'sandbox'::"text" NOT NULL
);


ALTER TABLE "public"."credit_packages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."credit_purchases" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "credit_package_id" "uuid" NOT NULL,
    "paddle_transaction_id" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "credits_amount" integer NOT NULL,
    "price_paid_cents" integer NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "paddle_checkout_id" "text",
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "environment" "text" DEFAULT 'sandbox'::"text" NOT NULL,
    CONSTRAINT "credit_purchases_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'completed'::"text", 'failed'::"text", 'refunded'::"text"])))
);


ALTER TABLE "public"."credit_purchases" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."credit_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "transaction_type" "text" NOT NULL,
    "amount" integer NOT NULL,
    "balance_before" integer NOT NULL,
    "balance_after" integer NOT NULL,
    "reference_id" "uuid",
    "reference_type" "text",
    "description" "text",
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    "environment" "text" DEFAULT 'sandbox'::"text" NOT NULL,
    CONSTRAINT "credit_transactions_transaction_type_check" CHECK (("transaction_type" = ANY (ARRAY['earn'::"text", 'consume'::"text", 'refund'::"text", 'expire'::"text", 'admin_adjust'::"text"])))
);


ALTER TABLE "public"."credit_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."languages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "code" "text"
);


ALTER TABLE "public"."languages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."literature_styles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."literature_styles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."narrators" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."narrators" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "newsletter_product" boolean DEFAULT true,
    "newsletter_marketing" boolean DEFAULT true,
    "newsletter_writing" boolean DEFAULT true,
    "email" "text" NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscription_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "price_id" "text" NOT NULL,
    "monthly_credits" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "environment" "text" DEFAULT 'sandbox'::"text" NOT NULL
);


ALTER TABLE "public"."subscription_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "subscription_id" "text" NOT NULL,
    "price_id" "text" NOT NULL,
    "status" "text" NOT NULL,
    "current_period_start" timestamp with time zone,
    "current_period_end" timestamp with time zone,
    "canceled_at" timestamp with time zone,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "environment" "text" DEFAULT 'sandbox'::"text" NOT NULL
);


ALTER TABLE "public"."subscriptions" OWNER TO "postgres";


ALTER TABLE "public"."subscriptions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."subscriptions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE OR REPLACE VIEW "public"."team_invitation_users" WITH ("security_invoker"='on') AS
 SELECT "u"."id",
    "u"."email",
    "p"."full_name",
    "p"."avatar_url"
   FROM ("auth"."users" "u"
     JOIN "public"."profiles" "p" ON (("u"."id" = "p"."id")));


ALTER TABLE "public"."team_invitation_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tones" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tones" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_credits" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "current_balance" integer DEFAULT 0 NOT NULL,
    "total_earned" integer DEFAULT 0 NOT NULL,
    "total_consumed" integer DEFAULT 0 NOT NULL,
    "last_refill_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "environment" "text" DEFAULT 'sandbox'::"text" NOT NULL
);


ALTER TABLE "public"."user_credits" OWNER TO "postgres";


ALTER TABLE ONLY "public"."annotation_replies"
    ADD CONSTRAINT "annotation_replies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."annotations"
    ADD CONSTRAINT "annotations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."book_categories"
    ADD CONSTRAINT "book_categories_pkey" PRIMARY KEY ("book_id", "category_id");



ALTER TABLE ONLY "public"."book_generations"
    ADD CONSTRAINT "book_generations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chapter_versions"
    ADD CONSTRAINT "chapter_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chapters"
    ADD CONSTRAINT "chapters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."credit_packages"
    ADD CONSTRAINT "credit_packages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."credit_packages"
    ADD CONSTRAINT "credit_packages_price_id_key" UNIQUE ("price_id");



ALTER TABLE ONLY "public"."credit_purchases"
    ADD CONSTRAINT "credit_purchases_paddle_transaction_id_key" UNIQUE ("paddle_transaction_id");



ALTER TABLE ONLY "public"."credit_purchases"
    ADD CONSTRAINT "credit_purchases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."credit_transactions"
    ADD CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."literature_styles"
    ADD CONSTRAINT "literature_styles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."literature_styles"
    ADD CONSTRAINT "literature_styles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."narrators"
    ADD CONSTRAINT "narrators_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."narrators"
    ADD CONSTRAINT "narrators_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_plans"
    ADD CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_plans"
    ADD CONSTRAINT "subscription_plans_price_id_key" UNIQUE ("price_id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_subscription_id_key" UNIQUE ("subscription_id");



ALTER TABLE ONLY "public"."tones"
    ADD CONSTRAINT "tones_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."tones"
    ADD CONSTRAINT "tones_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_credits"
    ADD CONSTRAINT "user_credits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_credits"
    ADD CONSTRAINT "user_credits_user_id_environment_key" UNIQUE ("user_id", "environment");



ALTER TABLE ONLY "public"."user_credits"
    ADD CONSTRAINT "user_credits_user_id_key" UNIQUE ("user_id");



CREATE INDEX "idx_annotation_replies_annotation_id" ON "public"."annotation_replies" USING "btree" ("annotation_id");



CREATE INDEX "idx_annotation_replies_user_id" ON "public"."annotation_replies" USING "btree" ("user_id");



CREATE INDEX "idx_annotations_chapter_id" ON "public"."annotations" USING "btree" ("chapter_id");



CREATE INDEX "idx_annotations_created_at" ON "public"."annotations" USING "btree" ("created_at");



CREATE INDEX "idx_annotations_status" ON "public"."annotations" USING "btree" ("status");



CREATE INDEX "idx_annotations_user_id" ON "public"."annotations" USING "btree" ("user_id");



CREATE INDEX "idx_book_generations_status" ON "public"."book_generations" USING "btree" ("status");



CREATE INDEX "idx_book_generations_user_id" ON "public"."book_generations" USING "btree" ("user_id");



CREATE INDEX "idx_books_language_id" ON "public"."books" USING "btree" ("language_id");



CREATE INDEX "idx_books_literature_style_id" ON "public"."books" USING "btree" ("literature_style_id");



CREATE INDEX "idx_books_narrator_id" ON "public"."books" USING "btree" ("narrator_id");



CREATE INDEX "idx_books_team_id" ON "public"."books" USING "btree" ("team_id");



CREATE INDEX "idx_books_tone_id" ON "public"."books" USING "btree" ("tone_id");



CREATE INDEX "idx_books_user_id" ON "public"."books" USING "btree" ("user_id");



CREATE INDEX "idx_chapter_versions_chapter_id" ON "public"."chapter_versions" USING "btree" ("chapter_id");



CREATE INDEX "idx_chapters_book_id" ON "public"."chapters" USING "btree" ("book_id");



CREATE INDEX "idx_chapters_order" ON "public"."chapters" USING "btree" ("order");



CREATE INDEX "idx_credit_packages_active" ON "public"."credit_packages" USING "btree" ("is_active");



CREATE INDEX "idx_credit_purchases_paddle_transaction" ON "public"."credit_purchases" USING "btree" ("paddle_transaction_id");



CREATE INDEX "idx_credit_purchases_status" ON "public"."credit_purchases" USING "btree" ("status");



CREATE INDEX "idx_credit_purchases_user_id" ON "public"."credit_purchases" USING "btree" ("user_id");



CREATE INDEX "idx_credit_transactions_created_at" ON "public"."credit_transactions" USING "btree" ("created_at");



CREATE INDEX "idx_credit_transactions_reference" ON "public"."credit_transactions" USING "btree" ("reference_id", "reference_type");



CREATE INDEX "idx_credit_transactions_user_id" ON "public"."credit_transactions" USING "btree" ("user_id");



CREATE INDEX "idx_customer_id" ON "public"."subscriptions" USING "btree" ("user_id");



CREATE INDEX "idx_subscription_id" ON "public"."subscriptions" USING "btree" ("subscription_id");



CREATE INDEX "idx_user_credits_user_id" ON "public"."user_credits" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "handle_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_annotation_replies_updated_at" BEFORE UPDATE ON "public"."annotation_replies" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_annotations_updated_at" BEFORE UPDATE ON "public"."annotations" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_book_generations_updated_at" BEFORE UPDATE ON "public"."book_generations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_books_updated_at" BEFORE UPDATE ON "public"."books" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_chapters_updated_at" BEFORE UPDATE ON "public"."chapters" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_credit_packages_updated_at" BEFORE UPDATE ON "public"."credit_packages" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_credit_purchases_updated_at" BEFORE UPDATE ON "public"."credit_purchases" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_user_credits_updated_at" BEFORE UPDATE ON "public"."user_credits" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."annotation_replies"
    ADD CONSTRAINT "annotation_replies_annotation_id_fkey" FOREIGN KEY ("annotation_id") REFERENCES "public"."annotations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."annotation_replies"
    ADD CONSTRAINT "annotation_replies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."annotations"
    ADD CONSTRAINT "annotations_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."annotations"
    ADD CONSTRAINT "annotations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."book_categories"
    ADD CONSTRAINT "book_categories_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."book_categories"
    ADD CONSTRAINT "book_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."book_generations"
    ADD CONSTRAINT "book_generations_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."book_generations"
    ADD CONSTRAINT "book_generations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id");



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_literature_style_id_fkey" FOREIGN KEY ("literature_style_id") REFERENCES "public"."literature_styles"("id");



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_narrator_id_fkey" FOREIGN KEY ("narrator_id") REFERENCES "public"."narrators"("id");



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_tone_id_fkey" FOREIGN KEY ("tone_id") REFERENCES "public"."tones"("id");



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."chapter_versions"
    ADD CONSTRAINT "chapter_versions_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chapter_versions"
    ADD CONSTRAINT "chapter_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."chapters"
    ADD CONSTRAINT "chapters_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."credit_purchases"
    ADD CONSTRAINT "credit_purchases_credit_package_id_fkey" FOREIGN KEY ("credit_package_id") REFERENCES "public"."credit_packages"("id");



ALTER TABLE ONLY "public"."credit_purchases"
    ADD CONSTRAINT "credit_purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."credit_transactions"
    ADD CONSTRAINT "credit_transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."credit_transactions"
    ADD CONSTRAINT "credit_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_credits"
    ADD CONSTRAINT "user_credits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Authenticated users can read all profiles" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Credit packages are viewable by authenticated users" ON "public"."credit_packages" FOR SELECT USING ((("auth"."role"() = 'authenticated'::"text") AND ("is_active" = true)));



CREATE POLICY "Enable read access for all users" ON "public"."categories" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."languages" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."literature_styles" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."narrators" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."subscriptions" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."tones" FOR SELECT USING (true);



CREATE POLICY "Service role full access credits" ON "public"."user_credits" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role full access generations" ON "public"."book_generations" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role full access packages" ON "public"."credit_packages" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role full access purchases" ON "public"."credit_purchases" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Service role full access transactions" ON "public"."credit_transactions" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Users can delete their own annotations" ON "public"."annotations" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete their own replies" ON "public"."annotation_replies" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can manage categories for their own books" ON "public"."book_categories" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."books"
  WHERE (("books"."id" = "book_categories"."book_id") AND ("books"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own annotations" ON "public"."annotations" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own replies" ON "public"."annotation_replies" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view own book generations" ON "public"."book_generations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own credits" ON "public"."user_credits" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own purchases" ON "public"."credit_purchases" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own transactions" ON "public"."credit_transactions" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."annotation_replies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."annotations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."book_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."book_generations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."books" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chapter_versions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chapters" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."credit_packages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."credit_purchases" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."credit_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."languages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."literature_styles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."narrators" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscription_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tones" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_credits" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."book_generations";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."books";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."credit_transactions";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."user_credits";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."add_purchased_credits"("p_user_id" "uuid", "p_purchase_id" "uuid", "p_credits_amount" integer, "p_description" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."add_purchased_credits"("p_user_id" "uuid", "p_purchase_id" "uuid", "p_credits_amount" integer, "p_description" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_purchased_credits"("p_user_id" "uuid", "p_purchase_id" "uuid", "p_credits_amount" integer, "p_description" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."consume_reserved_credits"("p_user_id" "uuid", "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."consume_reserved_credits"("p_user_id" "uuid", "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."consume_reserved_credits"("p_user_id" "uuid", "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_random_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_random_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_random_user_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_credits"("p_user_id" "uuid", "p_environment" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_credits"("p_user_id" "uuid", "p_environment" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_credits"("p_user_id" "uuid", "p_environment" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_paddle_webhook"("event" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."handle_paddle_webhook"("event" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_paddle_webhook"("event" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."manage_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_operation" "text", "p_reference_id" "uuid", "p_reference_type" "text", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."manage_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_operation" "text", "p_reference_id" "uuid", "p_reference_type" "text", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."manage_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_operation" "text", "p_reference_id" "uuid", "p_reference_type" "text", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."refund_reserved_credits"("p_user_id" "uuid", "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."refund_reserved_credits"("p_user_id" "uuid", "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."refund_reserved_credits"("p_user_id" "uuid", "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."reserve_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."reserve_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."reserve_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_book_generation_id" "uuid", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_operation" "text", "p_reference_id" "uuid", "p_reference_type" "text", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_operation" "text", "p_reference_id" "uuid", "p_reference_type" "text", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_credits"("p_user_id" "uuid", "p_amount" integer, "p_operation" "text", "p_reference_id" "uuid", "p_reference_type" "text", "p_description" "text", "p_metadata" "jsonb", "p_environment" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."annotation_replies" TO "anon";
GRANT ALL ON TABLE "public"."annotation_replies" TO "authenticated";
GRANT ALL ON TABLE "public"."annotation_replies" TO "service_role";



GRANT ALL ON TABLE "public"."annotations" TO "anon";
GRANT ALL ON TABLE "public"."annotations" TO "authenticated";
GRANT ALL ON TABLE "public"."annotations" TO "service_role";



GRANT ALL ON TABLE "public"."book_categories" TO "anon";
GRANT ALL ON TABLE "public"."book_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."book_categories" TO "service_role";



GRANT ALL ON TABLE "public"."book_generations" TO "anon";
GRANT ALL ON TABLE "public"."book_generations" TO "authenticated";
GRANT ALL ON TABLE "public"."book_generations" TO "service_role";



GRANT ALL ON TABLE "public"."books" TO "anon";
GRANT ALL ON TABLE "public"."books" TO "authenticated";
GRANT ALL ON TABLE "public"."books" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."chapter_versions" TO "anon";
GRANT ALL ON TABLE "public"."chapter_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."chapter_versions" TO "service_role";



GRANT ALL ON TABLE "public"."chapters" TO "anon";
GRANT ALL ON TABLE "public"."chapters" TO "authenticated";
GRANT ALL ON TABLE "public"."chapters" TO "service_role";



GRANT ALL ON TABLE "public"."credit_packages" TO "anon";
GRANT ALL ON TABLE "public"."credit_packages" TO "authenticated";
GRANT ALL ON TABLE "public"."credit_packages" TO "service_role";



GRANT ALL ON TABLE "public"."credit_purchases" TO "anon";
GRANT ALL ON TABLE "public"."credit_purchases" TO "authenticated";
GRANT ALL ON TABLE "public"."credit_purchases" TO "service_role";



GRANT ALL ON TABLE "public"."credit_transactions" TO "anon";
GRANT ALL ON TABLE "public"."credit_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."credit_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."languages" TO "anon";
GRANT ALL ON TABLE "public"."languages" TO "authenticated";
GRANT ALL ON TABLE "public"."languages" TO "service_role";



GRANT ALL ON TABLE "public"."literature_styles" TO "anon";
GRANT ALL ON TABLE "public"."literature_styles" TO "authenticated";
GRANT ALL ON TABLE "public"."literature_styles" TO "service_role";



GRANT ALL ON TABLE "public"."narrators" TO "anon";
GRANT ALL ON TABLE "public"."narrators" TO "authenticated";
GRANT ALL ON TABLE "public"."narrators" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_plans" TO "anon";
GRANT ALL ON TABLE "public"."subscription_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_plans" TO "service_role";



GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."subscriptions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."subscriptions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."subscriptions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."team_invitation_users" TO "anon";
GRANT ALL ON TABLE "public"."team_invitation_users" TO "authenticated";
GRANT ALL ON TABLE "public"."team_invitation_users" TO "service_role";



GRANT ALL ON TABLE "public"."tones" TO "anon";
GRANT ALL ON TABLE "public"."tones" TO "authenticated";
GRANT ALL ON TABLE "public"."tones" TO "service_role";



GRANT ALL ON TABLE "public"."user_credits" TO "anon";
GRANT ALL ON TABLE "public"."user_credits" TO "authenticated";
GRANT ALL ON TABLE "public"."user_credits" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
