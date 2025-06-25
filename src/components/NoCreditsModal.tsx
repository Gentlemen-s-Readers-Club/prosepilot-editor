import React from 'react';
import { AlertCircle, CreditCard, Plus, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './ui/button';
import { useCreditPurchases } from '../hooks/useCreditPurchases';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { useToast } from '../hooks/use-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface NoCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits?: number;
  action?: string;
}

export function NoCreditsModal({ 
  isOpen, 
  onClose, 
  requiredCredits = 1, 
  action = "perform this action"
}: NoCreditsModalProps) {
  const { balance: {current_balance} } = useSelector((state: RootState) => state.userCredits);
  const { packages, loading, purchaseCredits, formatPrice } = useCreditPurchases();
  const { hasActiveSubscription } = useSubscriptions()
  const { toast } = useToast();

  const handlePurchase = async (packageId: string) => {
    const result = await purchaseCredits(packageId);
    
    if (result.success) {
      toast({
        title: "Credits Purchased!",
        description: "Your credits have been added to your account.",
        variant: "default",
      });
      onClose();
    } else {
      toast({
        title: "Purchase Failed",
        description: result.error || "Unable to process your credit purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRecommendedPackage = () => {
    if (!packages.length) return null;

    // First, try to find a package with discount_percentage
    const discountedPackage = packages.find(pkg => pkg.discount_percentage);
    if (discountedPackage) return discountedPackage;
    
    // If no discounted package found, find the smallest package that covers the required credits
    const suitablePackages = packages.filter(pkg => pkg.credits_amount >= requiredCredits);
    if (suitablePackages.length === 0) return packages[0]; // Fallback to smallest package
    
    
    return suitablePackages.reduce((best, current) => {
      const bestPricePerCredit = best.price_cents / best.credits_amount;
      const currentPricePerCredit = current.price_cents / current.credits_amount;
      return currentPricePerCredit < bestPricePerCredit ? current : best;
    });
  };

  const recommendedPackage = getRecommendedPackage();

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-brand-accent" />
              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-base-heading">
                Insufficient Credits
              </Dialog.Title>
            </div>
            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-brand-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          <Dialog.Description className="text-sm text-base-paragraph">
            You need {requiredCredits} credit{requiredCredits !== 1 ? 's' : ''} to {action}, but you currently have {current_balance} credit{current_balance !== 1 ? 's' : ''}.
          </Dialog.Description>

          <div className="space-y-4">
            {/* Credit Status */}
            <div className="bg-state-warning-light border border-state-warning rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-state-warning" />
                  <span className="text-sm font-medium text-state-warning">Credit Status</span>
                </div>

                {current_balance && (
                  <div className="text-right">
                    <div className="text-sm text-state-warning">
                        {current_balance} / {requiredCredits} credits
                    </div>
                    <div className="text-xs text-state-error">
                        {requiredCredits - current_balance} more needed
                    </div>
                  </div>  
                )}

              </div>
            </div>

            {/* Purchase Options */}
            {!hasActiveSubscription ? (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Purchase Credits</h3>
                
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {packages.slice(0, 3).map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`bg-white rounded-lg p-3 border transition-colors ${
                          recommendedPackage?.id === pkg.id 
                            ? 'border-brand-accent hover:border-brand-primary' 
                            : 'border hover:border-brand-primary'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-base-heading">
                                  {pkg.credits_amount} Credits
                                </span>
                                {pkg.discount_percentage > 0 && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    Save {pkg.discount_percentage}%
                                  </span>
                                )}
                                {recommendedPackage?.id === pkg.id && (
                                  <span className="text-xs bg-brand-accent text-white px-2 py-1 rounded">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-base-paragraph">
                                {formatPrice(pkg.price_cents, pkg.currency)}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handlePurchase(pkg.id)}
                            disabled={loading}
                          >
                            Buy
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-state-info-light border border-state-info rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-sm text-state-info">
                    <strong>Subscription Required:</strong> You need an active subscription to purchase credits. 
                    Please upgrade your account to continue.
                  </div>
                </div>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      window.location.href = '/workspace/subscription';
                    }}
                    className="text-state-info border-state-info hover:bg-state-info/10 hover:text-state-info"
                  >
                    Manage Subscription
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {hasActiveSubscription && recommendedPackage && (
              <Button 
                onClick={() => handlePurchase(recommendedPackage.id)}
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Buy {recommendedPackage.credits_amount} Credits
              </Button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
