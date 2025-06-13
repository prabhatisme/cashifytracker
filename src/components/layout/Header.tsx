import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">PriceTracker</h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">
                  {user?.email ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}