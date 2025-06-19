import React from "react";
import { Skeleton } from "../ui/skeleton";

export const CurrentPlanSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-5 w-40" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4">
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  </div>
);

export const PlanCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
    <div className="p-8 flex flex-col h-full">
      <div className="flex-1">
        {/* Plan Header */}
        <div className="text-center mb-8">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>

        {/* Pricing */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center">
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-6 w-12 ml-1" />
          </div>
          <Skeleton className="h-4 w-32 mx-auto mt-2" />
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-start">
              <Skeleton className="h-5 w-5 shrink-0 mt-0.5" />
              <Skeleton className="h-4 flex-1 ml-3" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);

export const PricingPlansSkeleton = () => (
  <div className="space-y-12 mt-20">
    <Skeleton className="h-10 w-48 mx-auto" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {[...Array(3)].map((_, index) => (
        <PlanCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

export const BillingHistorySkeleton = () => (
  <div className="mt-20">
    <Skeleton className="h-8 w-36 mb-6" />
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-50 px-6 py-3">
        <div className="grid grid-cols-5 gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="px-6 py-4">
            <div className="grid grid-cols-5 gap-4 items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-8 w-8 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SubscriptionPageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CurrentPlanSkeleton />
      <PricingPlansSkeleton />
      <BillingHistorySkeleton />
    </div>
  </div>
);
