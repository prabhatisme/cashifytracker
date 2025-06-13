import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { Product, PriceEntry } from '@/types';
import { format, subDays, subMonths, subYears, isAfter, parseISO } from 'date-fns';

interface PriceHistoryChartProps {
  product: Product;
}

type TimeRange = '1M' | '6M' | '1Y' | 'ALL';

interface ChartDataPoint {
  date: string;
  price: number;
  formattedDate: string;
  timestamp: number;
}

export function PriceHistoryChart({ product }: PriceHistoryChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M');

  const chartData = useMemo(() => {
    if (!product.price_history || product.price_history.length === 0) {
      return [];
    }

    const now = new Date();
    let cutoffDate: Date;

    switch (selectedRange) {
      case '1M':
        cutoffDate = subDays(now, 30);
        break;
      case '6M':
        cutoffDate = subMonths(now, 6);
        break;
      case '1Y':
        cutoffDate = subYears(now, 1);
        break;
      case 'ALL':
        cutoffDate = new Date(0); // Beginning of time
        break;
      default:
        cutoffDate = subDays(now, 30);
    }

    const filteredHistory = product.price_history
      .filter((entry: PriceEntry) => {
        const entryDate = parseISO(entry.checked_at);
        return isAfter(entryDate, cutoffDate);
      })
      .sort((a: PriceEntry, b: PriceEntry) => 
        new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime()
      );

    return filteredHistory.map((entry: PriceEntry) => {
      const date = parseISO(entry.checked_at);
      return {
        date: entry.checked_at,
        price: entry.price,
        formattedDate: format(date, selectedRange === '1M' ? 'MMM dd' : 'MMM yyyy'),
        timestamp: date.getTime(),
      };
    });
  }, [product.price_history, selectedRange]);

  const priceStats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        currentPrice: product.sale_price,
        highestPrice: product.sale_price,
        lowestPrice: product.sale_price,
        priceChange: 0,
        priceChangePercent: 0,
        trend: 'stable' as const,
      };
    }

    const prices = chartData.map(d => d.price);
    const currentPrice = prices[prices.length - 1];
    const firstPrice = prices[0];
    const highestPrice = Math.max(...prices);
    const lowestPrice = Math.min(...prices);
    const priceChange = currentPrice - firstPrice;
    const priceChangePercent = firstPrice > 0 ? ((priceChange / firstPrice) * 100) : 0;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (priceChange > 0) trend = 'up';
    else if (priceChange < 0) trend = 'down';

    return {
      currentPrice,
      highestPrice,
      lowestPrice,
      priceChange,
      priceChangePercent,
      trend,
    };
  }, [chartData, product.sale_price]);

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '1M', label: '1 Month' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: 'ALL', label: 'All Time' },
  ];

  const formatTooltipValue = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  const formatXAxisTick = (tickItem: string) => {
    const date = parseISO(tickItem);
    return format(date, selectedRange === '1M' ? 'dd' : 'MMM');
  };

  if (!product.price_history || product.price_history.length < 2) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Price History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Price History Available
            </h3>
            <p className="text-gray-600">
              Price tracking data will appear here as we monitor this product over time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Price History</span>
          </CardTitle>
          <div className="flex space-x-1">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={selectedRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRange(range.value)}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">Current Price</div>
            <div className="text-xl font-bold text-blue-900">
              ₹{priceStats.currentPrice.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">Lowest Price</div>
            <div className="text-xl font-bold text-green-900">
              ₹{priceStats.lowestPrice.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm text-red-600 font-medium">Highest Price</div>
            <div className="text-xl font-bold text-red-900">
              ₹{priceStats.highestPrice.toLocaleString()}
            </div>
          </div>
          
          <div className={`rounded-lg p-4 ${
            priceStats.trend === 'down' ? 'bg-green-50' : 
            priceStats.trend === 'up' ? 'bg-red-50' : 'bg-gray-50'
          }`}>
            <div className={`text-sm font-medium ${
              priceStats.trend === 'down' ? 'text-green-600' : 
              priceStats.trend === 'up' ? 'text-red-600' : 'text-gray-600'
            }`}>
              Price Change
            </div>
            <div className={`text-xl font-bold flex items-center space-x-1 ${
              priceStats.trend === 'down' ? 'text-green-900' : 
              priceStats.trend === 'up' ? 'text-red-900' : 'text-gray-900'
            }`}>
              {priceStats.trend === 'down' && <TrendingDown className="h-4 w-4" />}
              {priceStats.trend === 'up' && <TrendingUp className="h-4 w-4" />}
              <span>
                {priceStats.priceChange >= 0 ? '+' : ''}₹{priceStats.priceChange.toLocaleString()}
              </span>
            </div>
            <div className={`text-xs ${
              priceStats.trend === 'down' ? 'text-green-600' : 
              priceStats.trend === 'up' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {priceStats.priceChangePercent >= 0 ? '+' : ''}{priceStats.priceChangePercent.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={formatXAxisTick}
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(value) => [formatTooltipValue(value), 'Price']}
                  labelFormatter={(label) => {
                    const date = parseISO(label);
                    return format(date, 'MMM dd, yyyy HH:mm');
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Data for Selected Period
            </h3>
            <p className="text-gray-600">
              Try selecting a different time range to view price history.
            </p>
          </div>
        )}

        {/* Insights */}
        {chartData.length > 1 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">💡 Price Insights</h4>
            <div className="space-y-2 text-sm text-gray-700">
              {priceStats.trend === 'down' && (
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">Great Deal</Badge>
                  <span>Price has dropped by ₹{Math.abs(priceStats.priceChange).toLocaleString()} in this period!</span>
                </div>
              )}
              {priceStats.trend === 'up' && (
                <div className="flex items-center space-x-2">
                  <Badge className="bg-red-100 text-red-800">Price Increase</Badge>
                  <span>Price has increased by ₹{priceStats.priceChange.toLocaleString()} in this period.</span>
                </div>
              )}
              {priceStats.currentPrice === priceStats.lowestPrice && (
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">Lowest Ever</Badge>
                  <span>This is the lowest price we've seen for this product!</span>
                </div>
              )}
              <div>
                <span className="font-medium">Savings potential:</span> You could save up to ₹{(priceStats.highestPrice - priceStats.lowestPrice).toLocaleString()} by buying at the right time.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}