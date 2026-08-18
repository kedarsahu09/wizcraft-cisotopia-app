// app/layout.tsx
import type { ReactNode } from 'react';
import { CartProvider } from '../components/CartContext';
import '../public/styles/reset.css';

export const metadata = {
  title: 'CISOtopia - The Cybersecurity Toy Store',
  description: 'Your one-stop shop for cybersecurity themed toys, apparel, and candles',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}