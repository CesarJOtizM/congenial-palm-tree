'use client';

import { usePathname } from 'next/navigation';

import { Navigation } from './Navigation';

interface ConditionalNavigationProps {
  children: React.ReactNode;
}

export function ConditionalNavigation({
  children,
}: ConditionalNavigationProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';

  return (
    <>
      {!isAuthPage && <Navigation />}
      {children}
    </>
  );
}
