import React, { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Package, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductListProps {
  refreshTrigger: number;
}

export function ProductList({ refreshTrigger }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [user, refreshTrigger]);

  const fetchProducts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product removed from tracking');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to remove product');
    }
  };

  const handleRefreshAll = async () => {
    if (!session?.access_token) {
      toast.error('Please sign in to refresh products');
      return;
    }

    setRefreshing(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-prices`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh prices');
      }

      toast.success(`Updated ${data.updated} products`);
      await fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error refreshing prices:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to refresh prices');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefreshSingle = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || !session?.access_token) return;

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-prices`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh product');
      }

      toast.success('Product updated successfully');
      await fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error refreshing product:', error);
      toast.error('Failed to refresh product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products tracked yet
        </h3>
        <p className="text-gray-600">
          Add your first product URL above to start tracking prices
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Currently Tracking ({products.length})
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshAll}
          disabled={refreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Updating...' : 'Refresh All'}</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={handleDelete}
            onRefresh={handleRefreshSingle}
          />
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Auto-Update:</strong> All products are automatically checked for price changes every hour. 
          You can also manually refresh individual products or all products using the refresh buttons.
        </p>
      </div>
    </div>
  );
}