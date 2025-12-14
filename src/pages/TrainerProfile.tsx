import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Profile, FitnessPlan } from '@/types';
import { useFollows } from '@/hooks/useFollows';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import PlanCard from '@/components/PlanCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UserPlus, UserMinus } from 'lucide-react';

const TrainerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [trainer, setTrainer] = useState<Profile | null>(null);
  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, role } = useAuth();
  const { isFollowing, follow, unfollow } = useFollows();
  const { isSubscribed, subscribe } = useSubscriptions();
  const { toast } = useToast();
  const [followLoading, setFollowLoading] = useState(false);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  const following = id ? isFollowing(id) : false;

  useEffect(() => {
    const fetchTrainer = async () => {
      if (!id) return;

      const { data: trainerData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !trainerData) {
        console.error('Error fetching trainer:', error);
        setLoading(false);
        return;
      }

      setTrainer(trainerData);

      // Fetch trainer's plans
      const { data: plansData } = await supabase
        .from('fitness_plans')
        .select('*')
        .eq('trainer_id', id)
        .order('created_at', { ascending: false });

      const plansWithTrainer = (plansData || []).map(plan => ({
        ...plan,
        trainer: trainerData,
      }));

      setPlans(plansWithTrainer);
      setLoading(false);
    };

    fetchTrainer();
  }, [id]);

  const handleFollow = async () => {
    if (!id) return;
    setFollowLoading(true);

    if (following) {
      const { error } = await unfollow(id);
      if (error) {
        toast({ title: 'Failed to unfollow', variant: 'destructive' });
      }
    } else {
      const { error } = await follow(id);
      if (error) {
        toast({ title: 'Failed to follow', variant: 'destructive' });
      } else {
        toast({ title: 'Following!', description: `You are now following ${trainer?.name}` });
      }
    }
    setFollowLoading(false);
  };

  const handleSubscribe = async (planId: string) => {
    setSubscribingId(planId);
    const { error } = await subscribe(planId);
    
    if (error) {
      toast({
        title: 'Subscription failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Subscribed!',
        description: 'You now have access to this plan.',
      });
    }
    setSubscribingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-32 w-full mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen gradient-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-4xl mb-4">Trainer Not Found</h1>
          <Link to="/plans">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Plans
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dark">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link to="/plans" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Link>

        {/* Trainer Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 p-6 rounded-2xl bg-card border">
          <Avatar className="h-24 w-24 ring-4 ring-primary/20">
            <AvatarImage src={trainer.avatar_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground font-display text-4xl">
              {trainer.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="font-display text-4xl mb-2">{trainer.name}</h1>
            {trainer.bio && (
              <p className="text-muted-foreground">{trainer.bio}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {plans.length} {plans.length === 1 ? 'plan' : 'plans'} available
            </p>
          </div>

          {user && role === 'user' && user.id !== trainer.id && (
            <Button
              variant={following ? "outline" : "default"}
              onClick={handleFollow}
              disabled={followLoading}
              className={!following ? "gradient-primary" : ""}
            >
              {following ? (
                <>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Follow
                </>
              )}
            </Button>
          )}
        </div>

        {/* Trainer's Plans */}
        <h2 className="font-display text-2xl mb-6">
          PLANS BY <span className="text-gradient">{trainer.name.toUpperCase()}</span>
        </h2>

        {plans.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card">
            <p className="text-muted-foreground">This trainer hasn't created any plans yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSubscribed={isSubscribed(plan.id)}
                showSubscribeButton={role === 'user'}
                onSubscribe={() => handleSubscribe(plan.id)}
                subscribing={subscribingId === plan.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerProfile;
