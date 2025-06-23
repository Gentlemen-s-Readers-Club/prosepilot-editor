import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { 
  selectSubscriptions, 
  selectActiveSubscriptions, 
  selectCurrentPlan, 
  selectSubscriptionStatus, 
  selectHasActiveSubscription, 
  selectCanSubscribeToNewPlan,
  fetchUserSubscription
} from '../store/slices/subscriptionSlice';
import { Session } from '@supabase/supabase-js';

export interface Subscription {
  id: string;
  user_id: string;
  customer_id?: string;
  subscription_id: string;
  price_id: string;
  status: "active" | "canceled" | "past_due" | "paused" | "trialing";
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  canceled_at?: string | null;
  created_at: string;
  updated_at?: string;
}

interface SubscriptionStatus {
  isActive: boolean;
  planId: string | null;
  planName: string | null;
  canUpgrade: boolean;
  canDowngrade: boolean;
  hasMultipleSubscriptions: boolean;
  pendingCancellation: boolean;
}

interface UseSubscriptionsReturn {
  subscriptions: Subscription[];
  activeSubscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  hasActiveSubscription: boolean;
  hasActivePlan: (priceId: string) => boolean;
  canSubscribeToNewPlan: boolean;
  getCurrentPlan: () => string | null;
  getSubscriptionStatus: () => SubscriptionStatus;
  refetch: (session: Session | null) => Promise<void>;
}

export function useSubscriptions(): UseSubscriptionsReturn {
  const dispatch = useDispatch<AppDispatch>();
  
  // Use Redux selectors
  const subscriptions = useSelector(selectSubscriptions);
  const activeSubscriptions = useSelector(selectActiveSubscriptions);
  const currentPlan = useSelector(selectCurrentPlan);
  const subscriptionStatus = useSelector(selectSubscriptionStatus);
  const hasActiveSubscription = useSelector(selectHasActiveSubscription);
  const canSubscribeToNewPlan = useSelector(selectCanSubscribeToNewPlan);
  const { status, error } = useSelector((state: RootState) => state.subscription);

  // Helper function to check if user has active plan
  const hasActivePlanForPrice = (priceId: string): boolean => {
    return activeSubscriptions.some((sub) => sub.price_id === priceId);
  };

  // Get current plan (returns the plan ID)
  const getCurrentPlan = (): string | null => {
    return currentPlan;
  };

  // Get subscription status
  const getSubscriptionStatus = (): SubscriptionStatus => {
    return subscriptionStatus;
  };

  // Refetch subscriptions
  const refetch = async (session: Session | null): Promise<void> => {
    await dispatch(fetchUserSubscription(session));
  };

  return {
    subscriptions,
    activeSubscriptions,
    loading: status === 'loading',
    error,
    hasActiveSubscription,
    hasActivePlan: hasActivePlanForPrice,
    canSubscribeToNewPlan,
    getCurrentPlan,
    getSubscriptionStatus,
    refetch,
  };
}
