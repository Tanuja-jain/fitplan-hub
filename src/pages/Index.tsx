import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dumbbell, Users, Target, Zap, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen gradient-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="animate-fade-in font-display text-5xl md:text-7xl lg:text-8xl tracking-tight">
              TRANSFORM YOUR
              <span className="block text-gradient">FITNESS JOURNEY</span>
            </h1>
            
            <p className="mt-6 animate-fade-in text-lg md:text-xl text-muted-foreground" style={{ animationDelay: '0.1s' }}>
              Connect with certified trainers, access personalized fitness plans, 
              and achieve your goals with FitPlanHub.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {user ? (
                <>
                  <Link to="/plans">
                    <Button size="lg" className="gradient-primary text-lg px-8">
                      Browse Plans
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  {role === 'trainer' && (
                    <Link to="/dashboard">
                      <Button size="lg" variant="outline" className="text-lg px-8">
                        My Dashboard
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/auth?mode=signup">
                    <Button size="lg" className="gradient-primary text-lg px-8">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-4xl md:text-5xl mb-16">
            WHY CHOOSE <span className="text-gradient">FITPLANHUB</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Expert Trainers"
              description="Connect with certified fitness professionals who create personalized plans just for you."
            />
            <FeatureCard
              icon={<Target className="h-8 w-8" />}
              title="Tailored Plans"
              description="Access detailed workout and nutrition plans designed to help you reach your specific goals."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Track Progress"
              description="Follow trainers, subscribe to plans, and stay motivated on your fitness journey."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary glow-primary animate-pulse-glow">
                <Dumbbell className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h2 className="font-display text-4xl md:text-5xl mb-4">
              READY TO START?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of fitness enthusiasts and trainers on FitPlanHub today.
            </p>
            {!user && (
              <Link to="/auth?mode=signup">
                <Button size="lg" className="gradient-primary text-lg px-12">
                  Create Free Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FitPlanHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 font-display text-2xl">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Index;
