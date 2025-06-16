-- Credits system database schema for Supabase

-- 1. Subscription plans with credit allocations
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_id TEXT UNIQUE NOT NULL, -- Paddle price ID
  monthly_credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User credits balance
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_balance INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_consumed INTEGER NOT NULL DEFAULT 0,
  last_refill_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Credit transactions log (for audit trail)
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'consume', 'refund', 'expire', 'admin_adjust')),
  amount INTEGER NOT NULL, -- Positive for earn/refund, negative for consume/expire
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  reference_id UUID, -- Links to book_generations, subscriptions, etc.
  reference_type TEXT, -- 'book_generation', 'subscription_refill', 'admin', etc.
  description TEXT,
  metadata JSONB, -- Additional context (error details, admin notes, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) -- For admin adjustments
);

-- 4. Book generation tracking
CREATE TABLE book_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  credits_reserved INTEGER NOT NULL DEFAULT 0,
  credits_consumed INTEGER NOT NULL DEFAULT 0,
  book_title TEXT,
  generation_params JSONB, -- Store generation parameters
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Indexes for performance
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at);
CREATE INDEX idx_credit_transactions_reference ON credit_transactions(reference_id, reference_type);
CREATE INDEX idx_book_generations_user_id ON book_generations(user_id);
CREATE INDEX idx_book_generations_status ON book_generations(status);

-- 6. Row Level Security (RLS) policies
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_generations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own credits
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only see their own book generations
CREATE POLICY "Users can view own book generations" ON book_generations
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role full access credits" ON user_credits
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access transactions" ON credit_transactions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access generations" ON book_generations
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 7. Functions for credit operations
CREATE OR REPLACE FUNCTION get_user_credits(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  credits INTEGER;
BEGIN
  SELECT current_balance INTO credits
  FROM user_credits
  WHERE user_id = p_user_id;
  
  RETURN COALESCE(credits, 0);
END;
$$;

-- 8. Function to safely update credits with transaction logging
CREATE OR REPLACE FUNCTION update_user_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_transaction_type TEXT,
  p_reference_id UUID DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- Get current balance with row lock
  SELECT user_credits.current_balance INTO current_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  -- If user doesn't exist, create record
  IF current_balance IS NULL THEN
    INSERT INTO user_credits (user_id, current_balance, total_earned, total_consumed)
    VALUES (p_user_id, 0, 0, 0);
    current_balance := 0;
  END IF;
  
  new_balance := current_balance + p_amount;
  
  -- Prevent negative balance for consume operations
  IF new_balance < 0 AND p_transaction_type = 'consume' THEN
    RETURN FALSE;
  END IF;
  
  -- Update user credits
  UPDATE user_credits
  SET 
    current_balance = new_balance,
    total_earned = CASE WHEN p_amount > 0 THEN total_earned + p_amount ELSE total_earned END,
    total_consumed = CASE WHEN p_amount < 0 THEN total_consumed + ABS(p_amount) ELSE total_consumed END,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Log transaction
  INSERT INTO credit_transactions (
    user_id, transaction_type, amount, balance_before, balance_after,
    reference_id, reference_type, description, metadata
  ) VALUES (
    p_user_id, p_transaction_type, p_amount, current_balance, new_balance,
    p_reference_id, p_reference_type, p_description, p_metadata
  );
  
  RETURN TRUE;
END;
$$;

-- 9. Insert default subscription plans
INSERT INTO subscription_plans (name, price_id, monthly_credits) VALUES
('Starter', 'pri_01jxbekwgfx9k8tm8cbejzrns6', 5),
('Pro', 'pri_01jxben1kf0pfntb8162sfxhba', 20),
('Studio', 'pri_01jxxb51m8t8edd9w3wvw96bt4', 75);


-- 10. Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON user_credits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_generations_updated_at BEFORE UPDATE ON book_generations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 