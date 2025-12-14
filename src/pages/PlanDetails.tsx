import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FitnessPlan, Profile } from '@/types';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Clock, DollarSign, User, ArrowLeft, Lock, CheckCircle } from 'lucide-react';

const PlanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [trainer, setTrainer] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  const { user, role } = useAuth();
  const { isSubscribed, subscribe } = useSubscriptions();
  const { toast } = useToast();

  const subscribed = id ? isSubscribed(id) : false;

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;

      const { data: planData, error } = await supabase
        .from('fitness_plans')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !planData) {
        console.error('Error fetching plan:', error);
        setLoading(false);
        return;
      }

      setPlan(planData);

      // Fetch trainer
      const { data: trainerData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', planData.trainer_id)
        .maybeSingle();

      if (trainerData) {
        setTrainer(trainerData);
      }

      setLoading(false);
    };

    fetchPlan();
  }, [id]);

  const handleSubscribe = async () => {
    if (!user || !id) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to subscribe.',
        variant: 'destructive',
      });
      return;
    }

    setSubscribing(true);
    const { error } = await subscribe(id);

    if (error) {
      toast({
        title: 'Subscription failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Subscribed!',
        description: 'You now have full access to this plan.',
      });
    }
    setSubscribing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen gradient-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-4xl mb-4">Plan Not Found</h1>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="font-display text-4xl md:text-5xl">{plan.title}</h1>
                {subscribed && (
                  <Badge className="bg-success text-success-foreground">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Subscribed
                  </Badge>
                )}
              </div>

              {trainer && (
                <Link 
                  to={`/trainer/${trainer.id}`}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>by {trainer.name}</span>
                </Link>
              )}
            </div>

            <Card>
              <CardHeader>
                <h2 className="font-display text-2xl">Plan Details</h2>
              </CardHeader>
              <CardContent>
                {subscribed ? (
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{plan.description}</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Lock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-xl mb-2">Subscribe to View Full Details</h3>
                    <p className="text-muted-foreground mb-6">
                      Get access to the complete plan description, workouts, and more.
                    </p>
                    {role === 'user' && (
                      <Button 
                        onClick={handleSubscribe} 
                        disabled={subscribing}
                        className="gradient-primary"
                      >
                        {subscribing ? 'Processing...' : `Subscribe for $${Number(plan.price).toFixed(2)}`}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <div className="flex items-center gap-1 text-2xl font-bold">
                      <DollarSign className="h-5 w-5 text-accent" />
                      {Number(plan.price).toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {plan.duration} days
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    {subscribed ? (
                      <div className="text-center text-success">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-medium">You have access to this plan</p>
                      </div>
                    ) : role === 'user' ? (
                      <Button 
                        onClick={handleSubscribe} 
                        disabled={subscribing}
                        className="w-full gradient-primary"
                        size="lg"
                      >
                        {subscribing ? 'Processing...' : 'Subscribe Now'}
                      </Button>
                    ) : role === 'trainer' ? (
                      <p className="text-center text-sm text-muted-foreground">
                        Trainers cannot subscribe to plans
                      </p>
                    ) : (
                      <Link to="/auth" className="block">
                        <Button className="w-full gradient-primary" size="lg">
                          Sign In to Subscribe
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
