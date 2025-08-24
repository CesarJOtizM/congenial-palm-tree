'use client';

import { cn } from '@lib/utils';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  if (lines === 1) {
    return (
      <div
        className={cn(
          'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
          className
        )}
      />
    );
  }

  return (
    <div className='space-y-2'>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
            i === lines - 1 ? 'w-3/4' : 'w-full',
            className
          )}
          style={{ height: `${Math.max(16, 20 - i * 2)}px` }}
        />
      ))}
    </div>
  );
}

export function DebtCardSkeleton() {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse'>
      <div className='flex items-center justify-between mb-4'>
        <Skeleton className='h-6 w-48' />
        <Skeleton className='h-6 w-20' />
      </div>
      <Skeleton className='h-4 w-full mb-2' />
      <Skeleton className='h-4 w-3/4 mb-4' />
      <div className='flex justify-between items-center'>
        <Skeleton className='h-8 w-24' />
        <div className='flex space-x-2'>
          <Skeleton className='h-8 w-8 rounded-full' />
          <Skeleton className='h-8 w-8 rounded-full' />
        </div>
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse'>
      <div className='flex items-center'>
        <Skeleton className='h-12 w-12 rounded-full' />
        <div className='ml-4 flex-1'>
          <Skeleton className='h-4 w-24 mb-2' />
          <Skeleton className='h-8 w-16 mb-1' />
          <Skeleton className='h-3 w-20' />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
      <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
        <Skeleton className='h-6 w-32' />
      </div>
      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className='px-6 py-4'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <Skeleton className='h-4 w-48 mb-2' />
                <Skeleton className='h-3 w-32' />
              </div>
              <div className='flex items-center space-x-4'>
                <Skeleton className='h-6 w-20' />
                <div className='flex space-x-2'>
                  <Skeleton className='h-8 w-8 rounded-full' />
                  <Skeleton className='h-8 w-8 rounded-full' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Spinner({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size],
        className
      )}
    />
  );
}

export function LoadingOverlay({
  isLoading,
  children,
  message = 'Cargando...',
  className,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={cn('relative', className)}>
      {children}
      <div className='absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10'>
        <div className='text-center'>
          <Spinner size='lg' className='mx-auto mb-4' />
          <p className='text-gray-600 dark:text-gray-400'>{message}</p>
        </div>
      </div>
    </div>
  );
}
