import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Trash2, Loader2 } from 'lucide-react';
import { Product, PriceAlert } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PriceAlertDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PriceAlertDialog({ product, open, onOpenChange }: PriceAlertDialogProps) {
  const [targetPrice, setTargetPrice] = useState('');
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingAlerts, setFetchingAlerts] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      fetchAlerts();
    }
  }, [open, user, product.id]);

  const fetchAlerts = async () => {
    if (!user) return;

    setFetchingAlerts(true);
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('product_id', product.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to fetch price alerts');
    } finally {
      setFetchingAlerts(false);
    }
  };

  const handleCreateAlert = async () => {
    if (!user || !targetPrice) {
      toast.error('Please enter a target price');
      return;
    }

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (price >= product.sale_price) {
      toast.error('Target price should be lower than current price');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .insert({
          product_id: product.id,
          user_id: user.id,
          target_price: price,
        })
        .select()
        .single();

      if (error) throw error;

      setAlerts([data, ...alerts]);
      setTargetPrice('');
      toast.success('Price alert created successfully!');
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error('Failed to create price alert');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('price_alerts')
        .update({ is_active: !isActive, updated_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, is_active: !isActive }
          : alert
      ));

      toast.success(`Alert ${!isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast.error('Failed to update alert');
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast.success('Alert deleted successfully');
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error('Failed to delete alert');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-purple-600" />
            <span>Price Alerts</span>
          </DialogTitle>
          <DialogDescription>
            Get notified via email when the price drops below your target
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-sm text-gray-900 truncate">
              {product.title}
            </h4>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-bold text-gray-900">
                ₹{product.sale_price.toLocaleString()}
              </span>
              <Badge className="text-xs">Current Price</Badge>
            </div>
          </div>

          {/* Create New Alert */}
          <div className="space-y-3">
            <Label htmlFor="targetPrice">Set Target Price</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <Input
                  id="targetPrice"
                  type="number"
                  placeholder="Enter target price"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="pl-8"
                  disabled={loading}
                />
              </div>
              <Button 
                onClick={handleCreateAlert} 
                disabled={loading || !targetPrice}
                size="default"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Add Alert'
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-600">
              You'll receive an email when the price drops to or below your target price.
            </p>
          </div>

          {/* Existing Alerts */}
          <div className="space-y-3">
            <Label>Your Price Alerts</Label>
            {fetchingAlerts ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            ) : alerts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No price alerts set for this product
              </p>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-sm">
                          ₹{alert.target_price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Created {new Date(alert.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge 
                        variant={alert.is_active ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {alert.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAlert(alert.id, alert.is_active)}
                        className="h-8 w-8 p-0"
                      >
                        {alert.is_active ? (
                          <BellOff className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Bell className="h-4 w-4 text-purple-600" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}