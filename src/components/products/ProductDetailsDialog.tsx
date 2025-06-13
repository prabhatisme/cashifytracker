import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Calendar, 
  Smartphone, 
  Palette, 
  Package,
  TrendingDown,
  TrendingUp,
  Bell,
  BarChart3,
  Info
} from 'lucide-react';
import { Product } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { PriceHistoryChart } from './PriceHistoryChart';
import { PriceAlertDialog } from './PriceAlertDialog';

interface ProductDetailsDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailsDialog({ product, open, onOpenChange }: ProductDetailsDialogProps) {
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  
  const savings = product.mrp - product.sale_price;
  
  const getPriceChange = () => {
    if (product.price_history.length < 2) return null;
    
    const currentPrice = product.sale_price;
    const previousPrice = product.price_history[product.price_history.length - 2].price;
    
    if (currentPrice < previousPrice) {
      return { type: 'down', amount: previousPrice - currentPrice };
    } else if (currentPrice > previousPrice) {
      return { type: 'up', amount: currentPrice - previousPrice };
    }
    return { type: 'same', amount: 0 };
  };

  const priceChange = getPriceChange();

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'superb':
        return 'bg-emerald-100 text-emerald-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 pr-8">
              {product.title}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="price-history" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Price History</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Price Alerts</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Product Image and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image */}
                {product.image_url && (
                  <div className="md:col-span-1">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-64 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Product Details */}
                <div className={`space-y-4 ${product.image_url ? 'md:col-span-2' : 'md:col-span-3'}`}>
                  {/* Stock Status */}
                  {product.is_out_of_stock && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-red-800">
                        <Package className="w-5 h-5" />
                        <span className="font-medium">This product is currently out of stock</span>
                      </div>
                    </div>
                  )}

                  {/* Price Information */}
                  {!product.is_out_of_stock && (
                    <div className="bg-white border rounded-lg p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-3">
                              <span className="text-3xl font-bold text-gray-900">
                                ₹{product.sale_price.toLocaleString()}
                              </span>
                              {priceChange && priceChange.type !== 'same' && (
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
                                  priceChange.type === 'down' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {priceChange.type === 'down' ? (
                                    <TrendingDown className="w-4 h-4" />
                                  ) : (
                                    <TrendingUp className="w-4 h-4" />
                                  )}
                                  <span>₹{priceChange.amount.toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 mt-2">
                              <span className="text-lg text-gray-500 line-through">
                                ₹{product.mrp.toLocaleString()}
                              </span>
                              <Badge className="bg-green-100 text-green-800">
                                {product.discount} off
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="text-green-800">
                            <span className="font-semibold">You save: </span>
                            <span className="text-xl font-bold">₹{savings.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Product Specifications */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Badge className={getConditionColor(product.condition)}>
                          {product.condition}
                        </Badge>
                        <span className="text-sm text-gray-600">Condition</span>
                      </div>
                      
                      {product.storage && (
                        <div className="flex items-center space-x-2">
                          <Smartphone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">{product.storage}</span>
                        </div>
                      )}
                      
                      {product.color && (
                        <div className="flex items-center space-x-2">
                          <Palette className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">{product.color}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Last checked {formatDistanceToNow(new Date(product.last_checked))} ago
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button
                      className="flex-1"
                      onClick={() => window.open(product.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Cashify
                    </Button>
                    {!product.is_out_of_stock && (
                      <Button
                        variant="outline"
                        onClick={() => setShowPriceAlert(true)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Set Price Alert
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="price-history" className="mt-6">
              <PriceHistoryChart product={product} />
            </TabsContent>

            <TabsContent value="alerts" className="mt-6">
              <div className="text-center py-8">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Price Alerts
                </h3>
                <p className="text-gray-600 mb-6">
                  Set up price alerts to get notified when this product drops below your target price.
                </p>
                {!product.is_out_of_stock && (
                  <Button onClick={() => setShowPriceAlert(true)}>
                    <Bell className="w-4 h-4 mr-2" />
                    Create Price Alert
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {!product.is_out_of_stock && (
        <PriceAlertDialog
          product={product}
          open={showPriceAlert}
          onOpenChange={setShowPriceAlert}
        />
      )}
    </>
  );
}