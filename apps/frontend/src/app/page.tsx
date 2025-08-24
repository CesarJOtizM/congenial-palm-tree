'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <main className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div
        className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'
        role='status'
        aria-label='Cargando...'
      ></div>
    </main>
  );
}
