import { Profile } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrainerCardProps {
  trainer: Profile;
  isFollowing?: boolean;
  showFollowButton?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  loading?: boolean;
}

const TrainerCard = ({
  trainer,
  isFollowing = false,
  showFollowButton = false,
  onFollow,
  onUnfollow,
  loading = false,
}: TrainerCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
            <AvatarImage src={trainer.avatar_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground font-display text-xl">
              {trainer.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <Link 
              to={`/trainer/${trainer.id}`}
              className="font-display text-lg tracking-wide hover:text-primary transition-colors"
            >
              {trainer.name}
            </Link>
            {trainer.bio && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {trainer.bio}
              </p>
            )}
          </div>

          {showFollowButton && (
            <Button
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              onClick={isFollowing ? onUnfollow : onFollow}
              disabled={loading}
              className={!isFollowing ? "gradient-primary" : ""}
            >
              {isFollowing ? (
                <>
                  <UserMinus className="mr-1 h-4 w-4" />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="mr-1 h-4 w-4" />
                  Follow
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainerCard;
