import React from "react";
import { Button } from "../ui/button";
import { AlertCircle, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface SubscriptionDialogsProps {
  // Cancel dialog
  showCancelDialog: boolean;
  onCancelDialogChange: (open: boolean) => void;
  onConfirmCancel: () => void;
  cancelLoading: boolean;

  // Upgrade/Downgrade dialog
  showUpgradeDialog: boolean;
  onUpgradeDialogChange: (open: boolean) => void;
  selectedPlan: Plan | null;
  currentPlan: string | null;
  plans: Plan[];
  onConfirmUpgrade: () => void;
}

export const SubscriptionDialogs: React.FC<SubscriptionDialogsProps> = ({
  showCancelDialog,
  onCancelDialogChange,
  onConfirmCancel,
  cancelLoading,
  showUpgradeDialog,
  onUpgradeDialogChange,
  selectedPlan,
  currentPlan,
  plans,
  onConfirmUpgrade,
}) => {
  const isDowngrade = () => {
    if (!selectedPlan || !currentPlan) return false;
    const currentPlanIndex = plans.findIndex((p) => p.id === currentPlan);
    const selectedPlanIndex = plans.findIndex((p) => p.id === selectedPlan.id);
    return selectedPlanIndex < currentPlanIndex;
  };

  const getNewFeatures = () => {
    if (!selectedPlan || !currentPlan) return [];
    const currentPlanData = plans.find((p) => p.id === currentPlan);
    return selectedPlan.features.filter(
      (f) => !currentPlanData?.features.includes(f)
    );
  };

  const getLostFeatures = () => {
    if (!selectedPlan || !currentPlan) return [];
    const currentPlanData = plans.find((p) => p.id === currentPlan);
    return (
      currentPlanData?.features.filter(
        (f) => !selectedPlan.features.includes(f)
      ) || []
    );
  };

  return (
    <>
      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={onCancelDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll lose
              access to premium features immediately. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
            <div className="flex">
              <div className="shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Before you cancel
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your subscription will be cancelled immediately</li>
                    <li>You'll lose access to premium features right away</li>
                    <li>
                      Existing content will remain accessible but locked for
                      editing
                    </li>
                    <li>No further charges will be made</li>
                    <li>Your existing credits will remain in your account</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onCancelDialogChange(false)}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmCancel}
              disabled={cancelLoading}
            >
              {cancelLoading ? "Cancelling..." : "Cancel Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade/Downgrade Plan Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={onUpgradeDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isDowngrade()
                ? `Downgrade to ${selectedPlan?.name}`
                : `Upgrade to ${selectedPlan?.name}`}
            </DialogTitle>
            <DialogDescription>
              You're about to {isDowngrade() ? "downgrade" : "upgrade"} to the{" "}
              {selectedPlan?.name} plan. Changes will take effect at the start
              of your next billing period.
              {isDowngrade() &&
                " You'll continue to have access to your current plan's features until then."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">New Plan Cost</div>
                  <div className="text-sm text-base-paragraph">
                    Starting next billing period
                  </div>
                </div>
                <div className="text-lg font-bold">
                  ${selectedPlan?.price}/mo
                </div>
              </div>
            </div>

            {isDowngrade() ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Features You'll Lose
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {getLostFeatures().map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <Zap className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      New Features You'll Get
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {getNewFeatures().map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onUpgradeDialogChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={onConfirmUpgrade}>
              Confirm {isDowngrade() ? "Downgrade" : "Upgrade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
