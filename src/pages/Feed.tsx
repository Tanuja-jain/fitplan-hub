import { useFeed } from '@/hooks/useFeed';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useFollows } from '@/hooks/useFollows';
import { useAuth } from '@/context/AuthContext';
import PlanCard from '@/components/PlanCard';
import TrainerCard from '@/components/TrainerCard';
import Navbar from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const Feed = () => {
  const { plans, loading: plansLoading } = useFeed();
  const { isSubscribed, subscribe } = useSubscriptions();
  const { followedTrainers, loading: followsLoading, unfollow } = useFollows();
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null);

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

  const handleUnfollow = async (trainerId: string) => {
    setUnfollowingId(trainerId);
    const { error } = await unfollow(trainerId);
    
    if (error) {
      toast({
        title: 'Failed to unfollow',
        description: error.message,
        variant: 'destructive',
      });
    }
    setUnfollowingId(null);
  };

  if (!user || role !== 'user') {
    return (
      <div className="min-h-screen gradient-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-4xl mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">This page is only available for users.</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dark">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-4xl md:text-5xl mb-2">
          YOUR <span className="text-gradient">FEED</span>
        </h1>
        <p className="text-muted-foreground mb-8">
          Plans from trainers you follow
        </p>

        <Tabs defaultValue="plans">
          <TabsList>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="trainers">Following ({followedTrainers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="mt-6">
            {plansLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-card">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="font-display text-2xl mb-2">No Plans Yet</h2>
                <p className="text-muted-foreground mb-6">
                  Follow trainers to see their plans here.
                </p>
                <Link to="/plans">
                  <Button className="gradient-primary">Browse Plans</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plans.map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isSubscribed={isSubscribed(plan.id)}
                    showSubscribeButton
                    onSubscribe={() => handleSubscribe(plan.id)}
                    subscribing={subscribingId === plan.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trainers" className="mt-6">
            {followsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : followedTrainers.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-card">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="font-display text-2xl mb-2">Not Following Anyone</h2>
                <p className="text-muted-foreground mb-6">
                  Follow trainers to get updates on their plans.
                </p>
                <Link to="/plans">
                  <Button className="gradient-primary">Discover Trainers</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl">
                {followedTrainers.map(trainer => (
                  <TrainerCard
                    key={trainer.id}
                    trainer={trainer}
                    isFollowing
                    showFollowButton
                    onUnfollow={() => handleUnfollow(trainer.id)}
                    loading={unfollowingId === trainer.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Feed;
