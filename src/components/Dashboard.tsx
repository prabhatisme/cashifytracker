import React, { useState } from 'react';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';
import { ProductForm } from './products/ProductForm';
import { ProductList } from './products/ProductList';

export function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProductAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Track Your Favorite Products
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Monitor prices from Cashify and get notified when your desired products drop in price.
              Never miss a great deal again!
            </p>
          </div>

          {/* Product Form */}
          <div className="max-w-2xl mx-auto">
            <ProductForm onProductAdded={handleProductAdded} />
          </div>

          {/* Product List */}
          <div>
            <ProductList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}