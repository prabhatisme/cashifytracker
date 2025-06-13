import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  ExternalLink, 
  Trash2,
  Calendar,
  Smartphone,
  RefreshCw,
  Bell,
  Palette,
  AlertTriangle,
  Package
} from 'lucide-react';
import { Product } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { PriceAlertDialog } from './PriceAlertDialog';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onRefresh?: (id: string) => void;
}

export function ProductCard({ product, onDelete, onRefresh }: ProductCardProps) {
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  
  const discountPercentage = parseFloat(product.discount.replace('%', ''));
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

  const isRecentlyChecked = () => {
    const lastChecked = new Date(product.last_checked);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return lastChecked > oneHourAgo;
  };

  return (
    <>
      <Card className={`group hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border-white/20 ${
        product.is_out_of_stock ? 'opacity-75 border-red-200' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start space-x-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate text-sm leading-tight">
                {product.title}
              </h3>
              <div className="flex items-center flex-wrap gap-2 mt-2">
                {product.is_out_of_stock && (
                  <Badge variant="destructive" className="text-xs">
                    <Package className="w-3 h-3 mr-1" />
                    Out of Stock
                  </Badge>
                )}
                <Badge className={getConditionColor(product.condition)}>
                  {product.condition}
                </Badge>
                {product.storage && (
                  <Badge variant="outline" className="text-xs">
                    <Smartphone className="w-3 h-3 mr-1" />
                    {product.storage}
                  </Badge>
                )}
                {product.color && (
                  <Badge variant="outline" className="text-xs">
                    <Palette className="w-3 h-3 mr-1" />
                    {product.color}
                  </Badge>
                )}
              </div>
            </div>
            
            {product.image_url && (
              <div className="flex-shrink-0">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Out of Stock Warning */}
          {product.is_out_of_stock && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  This product is currently out of stock
                </span>
              </div>
            </div>
          )}

          {/* Price Information */}
          {!product.is_out_of_stock && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{product.sale_price.toLocaleString()}
                    </span>
                    {priceChange && priceChange.type !== 'same' && (
                      <div className={`flex items-center space-x-1 ${
                        priceChange.type === 'down' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {priceChange.type === 'down' ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <TrendingUp className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          ₹{priceChange.amount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="line-through">₹{product.mrp.toLocaleString()}</span>
                    <span className="text-green-600 font-medium">
                      {product.discount} off
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-green-800">
                  <span className="font-medium">You save: </span>
                  ₹{savings.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Price History Summary */}
          {product.price_history.length > 1 && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Price tracked for: </span>
                {product.price_history.length} updates
              </div>
            </div>
          )}

          {/* Last Checked */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3" />
              <span>
                Last checked {formatDistanceToNow(new Date(product.last_checked))} ago
              </span>
            </div>
            {!isRecentlyChecked() && (
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                Due for update
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(product.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Product
            </Button>
            {!product.is_out_of_stock && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPriceAlert(true)}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <Bell className="w-4 h-4" />
              </Button>
            )}
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRefresh(product.id)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

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