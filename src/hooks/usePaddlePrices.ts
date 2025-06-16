import { useEffect, useState } from "react";
import { Paddle } from "@paddle/paddle-js";
import { PaddlePrices } from "../types/paddle";

interface PaddlePrice {
  id: string;
  description: string;
  productId: string;
  name: string;
  unitPrice: {
    amount: string;
    currency_code: string;
  };
  billingCycle?: {
    interval: string;
    frequency: number;
  };
}

interface PaddleResponsePrice {
  id: string;
  name: string;
  description: string;
  customData: null;
  status: string;
  billingCycle: {
    interval: string;
    frequency: number;
  };
  productId: string;
  quantity: {
    minimum: number;
    maximum: number;
  };
  taxMode: string;
  trialPeriod: null;
  unitPrice: {
    amount: string;
    currencyCode: string;
  };
  unitPriceOverrides: Record<string, never>[];
  importMeta: null;
}

interface PaddleResponseProduct {
  id: string;
  name: string;
  description: string;
  taxCategory: string;
  imageUrl: string;
  customData: null;
  status: string;
  createdAt: string;
  importMeta: null;
}

interface PaddleResponseTotals {
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
}

interface PaddleResponseLineItem {
  price: PaddleResponsePrice;
  quantity: number;
  taxRate: string;
  unitTotals: PaddleResponseTotals;
  formattedUnitTotals: PaddleResponseTotals;
  totals: PaddleResponseTotals;
  formattedTotals: PaddleResponseTotals;
  product: PaddleResponseProduct;
  discounts: Record<string, never>[];
}

interface PaddleResponse {
  data: {
    customerId: null;
    addressId: null;
    businessId: null;
    currencyCode: string;
    address: {
      countryCode: string;
      postalCode: string;
    };
    customerIpAddress: null;
    discountId: null;
    details: {
      lineItems: PaddleResponseLineItem[];
    };
    availablePaymentMethods: string[];
  };
  meta: {
    requestId: string;
  };
}

export function usePaddlePrices(paddle: Paddle | null) {
  const [prices, setPrices] = useState<PaddlePrices>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availablePrices, setAvailablePrices] = useState<PaddlePrice[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      if (!paddle) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get all available prices using price preview
        const response = await paddle.PricePreview({
          items: [
            { priceId: "pri_01jxben1kf0pfntb8162sfxhba", quantity: 1 },
            { priceId: "pri_01jxbekwgfx9k8tm8cbejzrns6", quantity: 1 },
            { priceId: "pri_01jxxb51m8t8edd9w3wvw96bt4", quantity: 1 },
          ],
        });

        // Log the response to debug the structure
        console.log("Paddle PricePreview response:", response);

        const pricePreview = response as unknown as PaddleResponse;

        if (!pricePreview?.data?.details?.lineItems) {
          throw new Error("Invalid response structure from Paddle");
        }

        const prices: PaddlePrice[] = pricePreview.data.details.lineItems.map(
          (item) => ({
            id: item.price.id,
            name: item.price.name,
            description: item.price.description,
            productId: item.price.productId,
            unitPrice: {
              amount: item.price.unitPrice.amount,
              currency_code: item.price.unitPrice.currencyCode,
            },
            billingCycle: item.price.billingCycle
              ? {
                  interval: item.price.billingCycle.interval,
                  frequency: item.price.billingCycle.frequency,
                }
              : undefined,
          })
        );

        setAvailablePrices(prices);

        // Create formatted prices object using the formatted totals
        const formattedPrices = pricePreview.data.details.lineItems.reduce(
          (acc, item) => {
            acc[item.price.id] = item.formattedTotals.total;
            return acc;
          },
          {} as PaddlePrices
        );

        setPrices(formattedPrices);
      } catch (err) {
        console.error("Failed to fetch Paddle prices:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch prices");
        }
        setPrices({});
        setAvailablePrices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [paddle]);

  return { prices, loading, error, availablePrices };
}
