'use client';

import { useAuth } from '@contexts/AuthContext';
import { cn } from '@lib/utils';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav
      className={cn('bg-white shadow-sm border-b border-gray-200', className)}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link href='/dashboard' className='flex items-center'>
              <h1 className='text-2xl font-bold text-blue-600'>Dutch</h1>
            </Link>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-3'>
              <span className='text-sm text-gray-700'>{user?.fullName}</span>

              <button
                onClick={handleLogout}
                className='text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors'
              >
                <LogOut className='h-4 w-4' />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
