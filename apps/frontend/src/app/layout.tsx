import { AuthGuard } from '@components/auth/AuthGuard';
import { ConditionalNavigation } from '@components/layout/ConditionalNavigation';
import { AuthProvider } from '@contexts/AuthContext';
import { NotificationProvider } from '@contexts/NotificationContext';
import '@styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dutch - Gestiona deudas entre amigos',
  description:
    'Aplicación para gestionar deudas entre amigos de manera fácil y eficiente',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body className={inter.className}>
        <NotificationProvider>
          <AuthProvider>
            <AuthGuard>
              <ConditionalNavigation>{children}</ConditionalNavigation>
            </AuthGuard>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
