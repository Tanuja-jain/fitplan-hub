export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface FitnessPlan {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  trainer_id: string;
  created_at: string;
  updated_at: string;
  trainer?: Profile;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  subscribed_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  trainer_id: string;
  followed_at: string;
}

export type UserRole = 'trainer' | 'user';
