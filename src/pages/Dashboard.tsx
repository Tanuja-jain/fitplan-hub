import { useState } from 'react';
import { useTrainerPlans } from '@/hooks/usePlans';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, DollarSign, Clock } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, role } = useAuth();
  const { plans, loading, createPlan, updatePlan, deletePlan } = useTrainerPlans();
  const { toast } = useToast();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', duration: '' });
  const [submitting, setSubmitting] = useState(false);

  if (!user || role !== 'trainer') {
    return <Navigate to="/" replace />;
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', duration: '' });
    setEditingPlan(null);
  };

  const handleCreate = async () => {
    setSubmitting(true);
    const { error } = await createPlan({
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      duration: parseInt(formData.duration) || 30,
    });
    
    if (error) {
      toast({ title: 'Failed to create plan', variant: 'destructive' });
    } else {
      toast({ title: 'Plan created!' });
      setIsCreateOpen(false);
      resetForm();
    }
    setSubmitting(false);
  };

  const handleUpdate = async (id: string) => {
    setSubmitting(true);
    const { error } = await updatePlan(id, {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      duration: parseInt(formData.duration) || 30,
    });
    
    if (error) {
      toast({ title: 'Failed to update plan', variant: 'destructive' });
    } else {
      toast({ title: 'Plan updated!' });
      resetForm();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await deletePlan(id);
    if (error) {
      toast({ title: 'Failed to delete plan', variant: 'destructive' });
    } else {
      toast({ title: 'Plan deleted' });
    }
  };

  const startEdit = (plan: any) => {
    setFormData({
      title: plan.title,
      description: plan.description,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
    });
    setEditingPlan(plan.id);
  };

  return (
    <div className="min-h-screen gradient-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl">TRAINER <span className="text-gradient">DASHBOARD</span></h1>
            <p className="text-muted-foreground">Manage your fitness plans</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary" onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" /> Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Plan</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Title</Label><Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                <div><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Price ($)</Label><Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                  <div><Label>Duration (days)</Label><Input type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} /></div>
                </div>
                <Button onClick={handleCreate} disabled={submitting} className="w-full gradient-primary">{submitting ? 'Creating...' : 'Create Plan'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-40" />)}</div>
        ) : plans.length === 0 ? (
          <Card className="text-center py-16"><p className="text-muted-foreground">No plans yet. Create your first plan!</p></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {plans.map(plan => (
              <Card key={plan.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <CardTitle className="font-display text-xl">{plan.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(plan)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingPlan === plan.id ? (
                    <div className="space-y-3">
                      <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                      <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                      <div className="flex gap-2">
                        <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Price" />
                        <Input type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="Days" />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdate(plan.id)} disabled={submitting} className="gradient-primary">Save</Button>
                        <Button variant="outline" onClick={resetForm}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{plan.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-accent" />${Number(plan.price).toFixed(2)}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{plan.duration} days</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
