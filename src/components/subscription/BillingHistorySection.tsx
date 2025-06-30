import { useBillingHistory } from "../../hooks/useBillingHistory";
import { Loader2, Download } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export function BillingHistorySection() {
  const {
    transactions,
    loading,
    error,
    formatAmount,
    formatDate,
    fetchInvoiceUrl,
  } = useBillingHistory();

  // Get subscription status to determine if billing history should be shown
  const { status: subscriptionStatus } = useSelector(
    (state: RootState) => state.subscription
  );

  // Don't show billing history if user has no active subscription
  if (!subscriptionStatus || subscriptionStatus === "error") {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-4 mt-12">
        <h2 className="text-xl font-semibold text-base-heading font-heading">
          Billing History
        </h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
        </div>
      </div>
    );
  }

  if (
    error?.includes("No subscription found") ||
    error?.includes("non-2xx status code")
  ) {
    return null;
  }

  if (error) {
    return (
      <div className="space-y-4 mt-12">
        <h2 className="text-xl font-semibold text-base-heading font-heading">
          Billing History
        </h2>
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg font-copy">
          Error loading billing history: {error}
        </div>
      </div>
    );
  }

  if (!transactions.length) {
    return null;
  }

  return (
    <div className="space-y-4 mt-12">
      <h2 className="text-xl font-semibold text-base-heading font-heading">
        Billing History
      </h2>
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-brand-primary text-white">
                <th className="text-left px-4 py-3 text-sm font-medium font-copy">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium font-copy">
                  Description
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium font-copy">
                  Amount
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium font-copy">
                  Status
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium font-copy">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter((transaction) => transaction.status === "completed")
                .map((transaction) => {
                  // Safely extract transaction details
                  const itemDetails = transaction.items?.[0];
                  const productName =
                    itemDetails?.price?.name || "Unknown Product";
                  const description = `${productName}`;

                  const handleInvoiceDownload = async () => {
                    const url = await fetchInvoiceUrl(transaction.id);
                    if (url) {
                      window.open(url, "_blank");
                    }
                  };

                  return (
                    <tr key={transaction.id} className="border-b last:border-0">
                      <td className="text-left px-4 py-3 text-sm text-base-content font-copy">
                        {formatDate(transaction.billed_at)}
                      </td>
                      <td className="text-left px-4 py-3 text-sm text-base-content font-copy">
                        {description}
                      </td>
                      <td className="text-center px-4 py-3 text-sm text-base-content font-copy">
                        {formatAmount(
                          transaction.details?.totals?.total || "0",
                          transaction.currency_code
                        )}
                      </td>
                      <td className="text-center px-4 py-3 text-sm font-copy">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 font-copy">
                          Completed
                        </span>
                      </td>
                      <td className="text-center px-4 py-3 text-sm font-copy">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleInvoiceDownload();
                          }}
                          className="text-brand-accent hover:text-brand-accent-hover"
                        >
                          <Download className="h-4 w-4 inline" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
