import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Link2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ProductFormProps {
  onProductAdded: () => void;
}

export function ProductForm({ onProductAdded }: ProductFormProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const validateCashifyUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'www.cashify.in' && url.includes('buy-refurbished');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a product URL');
      return;
    }

    if (!validateCashifyUrl(url)) {
      toast.error('Please enter a valid Cashify product URL');
      return;
    }

    if (!session?.access_token) {
      toast.error('Please sign in to track products');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scrape-product`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track product');
      }

      toast.success('Product added to tracking successfully!');
      setUrl('');
      onProductAdded();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-blue-600" />
          <span>Track New Product</span>
        </CardTitle>
        <CardDescription>
          Enter a Cashify product URL to start tracking its price
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Product URL</Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="url"
                type="url"
                placeholder="https://www.cashify.in/buy-refurbished-mobile-phones/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Product...
              </>
            ) : (
              'Track Product'
            )}
          </Button>
        </form>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> We currently support tracking products from Cashify.in. 
            Make sure to copy the complete product URL.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}