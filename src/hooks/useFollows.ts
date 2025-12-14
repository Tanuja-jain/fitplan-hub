import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/types';

export const useFollows = () => {
  const { user } = useAuth();
  const [followedTrainerIds, setFollowedTrainerIds] = useState<Set<string>>(new Set());
  const [followedTrainers, setFollowedTrainers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollows = async () => {
    if (!user) {
      setFollowedTrainerIds(new Set());
      setFollowedTrainers([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('follows')
      .select('trainer_id')
      .eq('follower_id', user.id);

    if (!error && data) {
      const trainerIds = data.map(f => f.trainer_id);
      setFollowedTrainerIds(new Set(trainerIds));

      // Fetch trainer profiles
      if (trainerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', trainerIds);
        
        setFollowedTrainers(profiles || []);
      } else {
        setFollowedTrainers([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFollows();
  }, [user]);

  const follow = async (trainerId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('follows')
      .insert({
        follower_id: user.id,
        trainer_id: trainerId,
      });

    if (!error) {
      fetchFollows();
    }
    return { error };
  };

  const unfollow = async (trainerId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('trainer_id', trainerId);

    if (!error) {
      fetchFollows();
    }
    return { error };
  };

  const isFollowing = (trainerId: string) => followedTrainerIds.has(trainerId);

  return { 
    followedTrainerIds, 
    followedTrainers, 
    loading, 
    follow, 
    unfollow, 
    isFollowing, 
    refetch: fetchFollows 
  };
};
