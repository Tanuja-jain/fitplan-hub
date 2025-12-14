import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FitnessPlan, Profile } from '@/types';
import { useAuth } from '@/context/AuthContext';

export const usePlans = () => {
  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Fetch trainer profiles
    const trainerIds = [...new Set(data?.map(p => p.trainer_id) || [])];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', trainerIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    
    const plansWithTrainers = data?.map(plan => ({
      ...plan,
      trainer: profileMap.get(plan.trainer_id) as Profile | undefined,
    })) || [];

    setPlans(plansWithTrainers);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return { plans, loading, error, refetch: fetchPlans };
};

export const useTrainerPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
      .eq('trainer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPlans(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const createPlan = async (plan: Omit<FitnessPlan, 'id' | 'created_at' | 'updated_at' | 'trainer_id' | 'trainer'>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('fitness_plans')
      .insert({
        ...plan,
        trainer_id: user.id,
      });

    if (!error) {
      fetchPlans();
    }
    return { error };
  };

  const updatePlan = async (id: string, plan: Partial<FitnessPlan>) => {
    const { error } = await supabase
      .from('fitness_plans')
      .update(plan)
      .eq('id', id);

    if (!error) {
      fetchPlans();
    }
    return { error };
  };

  const deletePlan = async (id: string) => {
    const { error } = await supabase
      .from('fitness_plans')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchPlans();
    }
    return { error };
  };

  return { plans, loading, error, createPlan, updatePlan, deletePlan, refetch: fetchPlans };
};
