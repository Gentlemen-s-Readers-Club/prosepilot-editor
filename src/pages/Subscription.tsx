import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Check, AlertCircle, Clock, FileText, Download, Users, Zap, Crown, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

interface Plan {
  id: string;
  name: string;
  price: number;
  icon: JSX.Element;
  color: string;
  description: string;
  features: string[];
  credits: number;
  isPopular?: boolean;
  comingSoon?: boolean;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    credits: 5, // 1 book
    icon: <FileText className="w-6 h-6" />,
    color: 'bg-green-500',
    description: 'For hobbyists and first-time users',
    features: [
      '5 credits/month (1 book)',
      'Max 15,000 words/book',
      'Basic genre selection',
      'AI-generated outline + simple chapter flow',
      'Plot and character consistency checker',
      'Export to watermarked PDF and ePub',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Author',
    price: 29,
    credits: 25, // 5 books
    icon: <Crown className="w-6 h-6" />,
    color: 'bg-blue-500',
    description: 'For aspiring writers ready to go deeper',
    features: [
      '25 credits/month (5 books)',
      'Max 60,000 words/book',
      'Unlock more genres',
      'Advanced book properties (narrator, tone, style)',
      'Cover generation (non-watermarked)',
      'Export to clean PDF, ePub, and Kindle formats',
      'AI-generated blurbs & summaries',
      'Priority email support'
    ],
    isPopular: true
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 79,
    credits: 75, // 15 books
    icon: <Users className="w-6 h-6" />,
    color: 'bg-orange-500',
    description: 'For professionals and small studios',
    features: [
      '75 credits/month (15 books)',
      'Max 100,000 words/book',
      'All Pro features',
      'AI-generated illustrations (50 credits/month)',
      'Cover designer with AI title/tagline generator',
      'Metadata & ISBN generation',
      'Publish-ready formatting',
      'Team access (up to 3 users)',
      'Priority live chat support'
    ],
    comingSoon: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    credits: -1, // Unlimited
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-danger',
    description: 'For publishers, agencies, and heavy users',
    features: [
      'Unlimited credits',
      'Unlimited users per team',
      'All Studio features',
      'API access',
      'Bulk book/series generation',
      'Custom AI model tuning',
      'Dedicated onboarding & success manager',
      'SLA-based priority support'
    ],
    comingSoon: true
  }
];

const mockBillingHistory = [
  {
    id: '1',
    date: '2025-03-15',
    amount: 29,
    status: 'paid',
    description: 'Pro Author Plan - Monthly'
  },
  {
    id: '2',
    date: '2025-02-15',
    amount: 29,
    status: 'paid',
    description: 'Pro Author Plan - Monthly'
  },
  {
    id: '3',
    date: '2025-01-15',
    amount: 9,
    status: 'paid',
    description: 'Starter Plan - Monthly'
  }
];

const creditPackages = [
  { id: 'small', credits: 10, price: 20 },
  { id: 'medium', credits: 25, price: 45, savings: 10 },
  { id: 'large', credits: 50, price: 80, savings: 20 },
];

export function Subscription() {
  const [currentPlan] = useState('pro');
  const [creditsUsed] = useState(15);
  const [creditsLimit] = useState(25);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showBuyCreditsDialog, setShowBuyCreditsDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof creditPackages[0] | null>(null);

  const handleUpgrade = (plan: Plan) => {
    if (plan.comingSoon) {
      return;
    }
    setSelectedPlan(plan);
    setShowUpgradeDialog(true);
  };

  const confirmUpgrade = async () => {
    // TODO: Implement upgrade logic
    setShowUpgradeDialog(false);
  };

  const handleCancel = async () => {
    // TODO: Implement cancellation logic
    setShowCancelDialog(false);
  };

  const handleBuyCredits = (pkg: typeof creditPackages[0]) => {
    setSelectedPackage(pkg);
    setShowBuyCreditsDialog(true);
  };

  const confirmBuyCredits = async () => {
    // TODO: Implement credit purchase logic
    setShowBuyCreditsDialog(false);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Current Plan Status */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Current Subscription</h2>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Next billing date: April 15, 2025</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-gray-600">Current Plan</div>
                <div className="text-2xl font-bold text-primary">Pro Author</div>
                <div className="text-gray-600">$29/month</div>
              </div>

              <div className="space-y-2">
                <div className="text-gray-600">Monthly Credits Used</div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-primary">
                        {Math.round((creditsUsed / creditsLimit) * 100)}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary">
                        {creditsUsed}/{creditsLimit} credits
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/10">
                    <div
                      style={{ width: `${(creditsUsed / creditsLimit) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>

            {/* Credits Section */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary">Buy More Credits</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {creditPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg font-semibold">
                        {pkg.credits} Credits
                      </div>
                      {!!pkg.savings && (
                      <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        Save {pkg.savings}%
                      </div>
                    )}
                      
                    </div>
                    <div className="text-2xl font-bold text-primary mb-4">${pkg.price}</div>
                    <Button
                      onClick={() => handleBuyCredits(pkg)}
                      className="w-full"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Buy Credits
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ${
                    plan.isPopular ? 'ring-2 ring-primary' : ''
                  } ${plan.comingSoon ? 'opacity-75' : ''}`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  {plan.comingSoon && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium">
                      Coming Soon
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className={`${plan.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-primary">${plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <ul className="mt-6 space-y-4 flex-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 shrink-0" />
                          <span className="ml-3 text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full mt-8"
                      variant={currentPlan === plan.id ? 'secondary' : 'default'}
                      onClick={() => handleUpgrade(plan)}
                      disabled={currentPlan === plan.id || plan.comingSoon}
                    >
                      {currentPlan === plan.id ? 'Current Plan' : 
                       plan.comingSoon ? 'Coming Soon' : 
                       plans.findIndex(p => p.id === plan.id) < plans.findIndex(p => p.id === currentPlan) ? 'Downgrade' : 'Upgrade'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-primary mb-6">Billing History</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockBillingHistory.map((bill) => (
                    <tr key={bill.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(bill.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
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
                        <Button variant="ghost" className="text-primary hover:text-primary/80">
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.
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
                    <li>Your subscription will remain active until April 15, 2025</li>
                    <li>You'll lose access to premium features after that date</li>
                    <li>Existing books will remain accessible but locked for editing</li>
                    <li>Unused credits will be lost</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
            >
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade/Downgrade Plan Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {plans.findIndex(p => p.id === selectedPlan?.id) < plans.findIndex(p => p.id === currentPlan) 
                ? `Downgrade to ${selectedPlan?.name}`
                : `Upgrade to ${selectedPlan?.name}`}
            </DialogTitle>
            <DialogDescription>
              You're about to {plans.findIndex(p => p.id === selectedPlan?.id) < plans.findIndex(p => p.id === currentPlan) ? 'downgrade' : 'upgrade'} to 
              the {selectedPlan?.name} plan. Changes will take effect at the start of your next billing period (April 15, 2025).
              {plans.findIndex(p => p.id === selectedPlan?.id) < plans.findIndex(p => p.id === currentPlan) && 
                " You'll continue to have access to your current plan's features until then."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">New Plan Cost</div>
                  <div className="text-sm text-gray-500">Starting next billing period</div>
                </div>
                <div className="text-lg font-bold">${selectedPlan?.price}/mo</div>
              </div>
            </div>
            {plans.findIndex(p => p.id === selectedPlan?.id) < plans.findIndex(p => p.id === currentPlan) ? (
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
                        {plans.find(p => p.id === currentPlan)?.features
                          .filter(f => !selectedPlan?.features.includes(f))
                          .map((feature, index) => (
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
                        {selectedPlan?.features
                          .filter(f => !plans.find(p => p.id === currentPlan)?.features.includes(f))
                          .map((feature, index) => (
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
              onClick={() => setShowUpgradeDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmUpgrade}>
              Confirm {plans.findIndex(p => p.id === selectedPlan?.id) < plans.findIndex(p => p.id === currentPlan) ? 'Downgrade' : 'Upgrade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Buy Credits Dialog */}
      <Dialog open={showBuyCreditsDialog} onOpenChange={setShowBuyCreditsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Additional Credits</DialogTitle>
            <DialogDescription>
              You're about to purchase {selectedPackage?.credits} credits for ${selectedPackage?.price}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{selectedPackage?.credits} Credits</div>
                  <div className="text-sm text-gray-500">
                    Can be used for {Math.floor((selectedPackage?.credits || 0) / 5)} books
                  </div>
                </div>
                <div className="text-lg font-bold">${selectedPackage?.price}</div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    About Credits
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Credits never expire</li>
                      <li>Each book costs 5 credits to create</li>
                      <li>Credits are non-refundable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBuyCreditsDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmBuyCredits}
            >
              Buy Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}