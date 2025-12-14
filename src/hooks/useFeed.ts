import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useFollows } from './useFollows';
import { FitnessPlan, Profile } from '@/types';

export const useFeed = () => {
  const { user } = useAuth();
  const { followedTrainerIds } = useFollows();
  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    if (!user || followedTrainerIds.size === 0) {
      setPlans([]);
      setLoading(false);
      return;
    }

    const trainerIdsArray = Array.from(followedTrainerIds);
    
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
      .in('trainer_id', trainerIdsArray)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feed:', error);
      setLoading(false);
      return;
    }

    // Fetch trainer profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', trainerIdsArray);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    
    const plansWithTrainers = data?.map(plan => ({
      ...plan,
      trainer: profileMap.get(plan.trainer_id) as Profile | undefined,
    })) || [];

    setPlans(plansWithTrainers);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [user, followedTrainerIds]);

  return { plans, loading, refetch: fetchFeed };
};
