import { useState } from 'react';
import { usePlans } from '@/hooks/usePlans';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/context/AuthContext';
import PlanCard from '@/components/PlanCard';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Plans = () => {
  const { plans, loading } = usePlans();
  const { isSubscribed, subscribe } = useSubscriptions();
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  const filteredPlans = plans.filter(plan =>
    plan.title.toLowerCase().includes(search.toLowerCase()) ||
    plan.trainer?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to subscribe to plans.',
        variant: 'destructive',
      });
      return;
    }

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

  return (
    <div className="min-h-screen gradient-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl mb-2">
            FITNESS <span className="text-gradient">PLANS</span>
          </h1>
          <p className="text-muted-foreground">
            Discover plans from top trainers and start your transformation today.
          </p>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search plans or trainers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              {search ? 'No plans match your search.' : 'No plans available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map(plan => (
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

export default Plans;
