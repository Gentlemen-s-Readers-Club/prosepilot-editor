import { useEffect, useState } from "react";
import { Paddle } from "@paddle/paddle-js";
import { PaddlePrices } from "../types/paddle";
import { getCreditPriceIds } from "../lib/paddle-config";

interface PaddlePrice {
  id: string;
  description: string;
  productId: string;
  name: string;
  unitPrice: {
    amount: string;
    currency_code: string;
  };
}

interface PaddleResponsePrice {
  id: string;
  name: string;
  description: string;
  customData: null;
  status: string;
  productId: string;
  quantity: {
    minimum: number;
    maximum: number;
  };
  taxMode: string;
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

export function usePaddleCreditPrices(paddle: Paddle | null) {
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

        // Get credit price IDs based on the current environment
        const priceIds = getCreditPriceIds();

        // Get all available prices using price preview
        const response = await paddle.PricePreview({
          items: priceIds.map((priceId) => ({ priceId, quantity: 1 })),
        });

        // Log the response to debug the structure
        console.log("Paddle Credit PricePreview response:", response);

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
        console.error("Failed to fetch Paddle credit prices:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch credit prices");
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
