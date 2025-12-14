import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useSubscriptions = () => {
  const { user } = useAuth();
  const [subscribedPlanIds, setSubscribedPlanIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    if (!user) {
      setSubscribedPlanIds(new Set());
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan_id')
      .eq('user_id', user.id);

    if (!error && data) {
      setSubscribedPlanIds(new Set(data.map(s => s.plan_id)));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  const subscribe = async (planId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_id: planId,
      });

    if (!error) {
      setSubscribedPlanIds(prev => new Set([...prev, planId]));
    }
    return { error };
  };

  const unsubscribe = async (planId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('plan_id', planId);

    if (!error) {
      setSubscribedPlanIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(planId);
        return newSet;
      });
    }
    return { error };
  };

  const isSubscribed = (planId: string) => subscribedPlanIds.has(planId);

  return { subscribedPlanIds, loading, subscribe, unsubscribe, isSubscribed, refetch: fetchSubscriptions };
};
