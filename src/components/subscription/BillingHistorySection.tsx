import React from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { BillingHistorySkeleton } from "./SubscriptionSkeleton";

interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  status: string;
  description: string;
}

interface BillingHistorySectionProps {
  billingHistory: BillingRecord[];
  loading: boolean;
}

export const BillingHistorySection: React.FC<BillingHistorySectionProps> = ({
  billingHistory,
  loading,
}) => {
  if (loading) {
    return <BillingHistorySkeleton />;
  }

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-bold text-base-heading mb-6">
        Billing History
      </h2>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-paragraph uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-paragraph uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-paragraph uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-paragraph uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-base-paragraph uppercase tracking-wider">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {billingHistory.map((bill) => (
              <tr key={bill.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(bill.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-heading">
                  {bill.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${bill.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {bill.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    className="text-base-heading hover:text-base-heading/80"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
