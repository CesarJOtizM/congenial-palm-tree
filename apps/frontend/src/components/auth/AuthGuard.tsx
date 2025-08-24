'use client';

import { useAuth } from '@contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // Si no está autenticado y no está en la página de auth, redirigir a auth
      if (!isAuthenticated && pathname !== '/auth') {
        router.push('/auth');
      }
      // Si está autenticado y está en la página de auth, redirigir al dashboard
      else if (isAuthenticated && pathname === '/auth') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600' />
      </div>
    );
  }

  // Si no está autenticado y no está en la página de auth, no mostrar nada
  if (!isAuthenticated && pathname !== '/auth') {
    return null;
  }

  // Si está en la página de auth, no mostrar la navegación
  if (pathname === '/auth') {
    return <>{children}</>;
  }

  // Si está autenticado, mostrar el contenido con navegación
  return <>{children}</>;
}
