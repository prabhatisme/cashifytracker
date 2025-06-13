import React from 'react';
import { TrendingUp, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-bold">PriceTracker</h2>
            </div>
            <p className="text-gray-400 text-sm">
              Your smart companion for tracking product prices and finding the best deals.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Real-time price monitoring</li>
              <li>Price history tracking</li>
              <li>Smart notifications</li>
              <li>Mobile responsive design</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>How it works</li>
              <li>FAQs</li>
              <li>Contact us</li>
              <li>Privacy policy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 PriceTracker. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sm text-gray-400 mt-2 sm:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>for smart shoppers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}