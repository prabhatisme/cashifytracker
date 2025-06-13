import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { TrendingUp } from 'lucide-react';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Logo and Hero Section */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">PriceTracker</h1>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Track Prices,
              <span className="text-blue-600"> Save Money</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
              Monitor product prices from Cashify and get notified when prices drop. 
              Never miss a deal again!
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600">Products Tracked</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">₹50L+</div>
                <div className="text-sm text-gray-600">Money Saved</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">5K+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div>
          <LoginForm 
            onToggleMode={() => setIsSignUp(!isSignUp)} 
            isSignUp={isSignUp} 
          />
        </div>
      </div>
    </div>
  );
}