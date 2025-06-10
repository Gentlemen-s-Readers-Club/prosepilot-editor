import { Paddle, EventHandler } from "@paddle/paddle-js";

export interface PaddleContextType {
  paddle: Paddle | null;
  loading: boolean;
  error: string | null;
}

export interface PaddleProviderProps {
  children: React.ReactNode;
}

export interface PaddlePrices {
  [key: string]: string;
}

export interface PaddleSubscription {
  id: string;
  status: string;
  startDate: string;
  nextBillDate: string;
  planId: string;
  planPrice: number;
  currency: string;
}

interface PaddleBillingCycle {
  interval: string;
  frequency: number;
}

interface PaddleUnitPrice {
  amount: string;
  currency_code: string;
}

interface PaddleTotals {
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
}

interface PaddleProduct {
  id: string;
  name: string;
  description: string;
  type: string;
  tax_category: string;
  image_url: string;
  custom_data: Record<string, unknown> | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface PaddlePrice {
  id: string;
  description: string;
  type: string;
  name: string;
  product_id: string;
  billing_cycle: PaddleBillingCycle;
  trial_period: Record<string, unknown> | null;
  tax_mode: string;
  unit_price: PaddleUnitPrice;
  unit_price_overrides: Record<string, unknown>[];
  custom_data: Record<string, unknown> | null;
  quantity: {
    minimum: number;
    maximum: number;
  };
  status: string;
  created_at: string;
  updated_at: string;
}

interface PaddleLineItem {
  price: PaddlePrice;
  quantity: number;
  tax_rate: string;
  unit_totals: PaddleTotals;
  formatted_unit_totals: PaddleTotals;
  totals: PaddleTotals;
  formatted_totals: PaddleTotals;
  product: PaddleProduct;
  discounts: Record<string, unknown>[];
}

interface PaddlePriceListResponse {
  data: {
    customer_id: string | null;
    address_id: string | null;
    business_id: string | null;
    currency_code: string;
    address: {
      postal_code: string;
      country_code: string;
    };
    customer_ip_address: string | null;
    discount_id: string | null;
    details: {
      lineItems: PaddleLineItem[];
    };
    available_payment_methods: string[];
  };
  meta: {
    request_id: string;
  };
}

declare module "@paddle/paddle-js" {
  interface Paddle {
    PricePreview(params: {
      items: Array<{ priceId?: string; quantity?: number }>;
      address?: {
        countryCode?: string;
        postalCode?: string;
      };
    }): Promise<PaddlePriceListResponse>;
    Environment: {
      set: (environment: string) => void;
    };
    Checkout: {
      open: (options: CheckoutOptions) => Promise<void>;
    };
    setEventHandler: (handler: EventHandler) => void;
    customers: {
      list: (params: {
        email: string;
      }) => Promise<{ data: Array<{ id: string }> }>;
    };
    subscriptions: {
      list: (params: { customerId: string }) => Promise<{
        data: Array<{
          status: string;
          items: Array<{
            price: {
              product: {
                name: string;
              };
            };
          }>;
        }>;
      }>;
    };
  }

  // ... keep existing types ...
}
