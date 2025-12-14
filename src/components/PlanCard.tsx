import { FitnessPlan } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlanCardProps {
  plan: FitnessPlan;
  isSubscribed?: boolean;
  showSubscribeButton?: boolean;
  onSubscribe?: () => void;
  subscribing?: boolean;
}

const PlanCard = ({ 
  plan, 
  isSubscribed = false, 
  showSubscribeButton = false,
  onSubscribe,
  subscribing = false
}: PlanCardProps) => {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-display text-xl tracking-wide line-clamp-2">
              {plan.title}
            </h3>
            {plan.trainer && (
              <Link 
                to={`/trainer/${plan.trainer_id}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <User className="h-3 w-3" />
                {plan.trainer.name}
              </Link>
            )}
          </div>
          {isSubscribed && (
            <Badge variant="default" className="bg-success text-success-foreground">
              Subscribed
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {isSubscribed ? (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {plan.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Subscribe to view full plan details
          </p>
        )}
        
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="h-4 w-4 text-accent" />
            <span className="font-semibold">${Number(plan.price).toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{plan.duration} days</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex w-full gap-2">
          <Link to={`/plan/${plan.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          {showSubscribeButton && !isSubscribed && (
            <Button 
              onClick={onSubscribe} 
              disabled={subscribing}
              className="gradient-primary"
            >
              {subscribing ? 'Processing...' : 'Subscribe'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
