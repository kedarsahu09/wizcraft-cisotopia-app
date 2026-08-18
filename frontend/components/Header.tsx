'use client';
// components/Header.tsx
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

const Header: React.FC = () => {
  const { openCart, cart } = useCart();

  useEffect(() => {
    // Simulate the toast animation from old main.js
    const toast = document.getElementById('toast');
    if (toast) {
      toast.setAttribute('data-showing', 'showing');
    }

    // Set body padding-top to match header height to prevent overlap when header is fixed
    const header = document.querySelector('header');
    if (header) {
      document.body.style.paddingTop = `32px`;
    }
  }, []);

  return (
    <header className="fixed">
      <a href="/ciso-candles" id="toast" data-showing="not_showing">New Drop - CISO Candles</a>
      <img data-role="logo" src="/images/logo.svg" alt="Logo" />
      <span data-role="header_text">The Cybersecurity Toy Store</span>
      <button type="button" data-role="svg_cart" data-action="show_side_cart" onClick={openCart} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
        <div>
          <svg viewBox="5.7 0 105.5 126.1">
            <path d="M99.8 28.4c0-1.2-0.9-2-2.1-2h-15c0 3.2 0 7.6 0 8.2 0 1.5-1.2 2.6-2.6 2.9 -1.5 0.3-2.9-0.9-3.2-2.3 0-0.3 0-0.3 0-0.6 0-0.9 0-4.7 0-8.2H40.1c0 3.2 0 7.3 0 8.2 0 1.5-1.2 2.9-2.6 2.9 -1.5 0-2.9-0.9-3.2-2.3 0-0.3 0-0.3 0-0.6 0-0.6 0-5 0-8.2h-15c-1.2 0-2 0.9-2 2L8.3 124c0 1.2 0.9 2.1 2.1 2.1h96.3c1.2 0 2.1-0.9 2.1-2.1L99.8 28.4z"></path>
            <path d="M59.1 5.9c-2.9 0-2 0-2.9 0 -2 0-4.4 0.6-6.4 1.5 -3.2 1.5-5.9 4.1-7.6 7.3 -0.9 1.8-1.5 3.5-1.8 5.6 0 0.9-0.3 1.5-0.3 2.3 0 1.2 0 2.1 0 3.2 0 1.5-1.2 2.9-2.6 2.9 -1.5 0-2.9-0.9-3.2-2.3 0-0.3 0-0.3 0-0.6 0-1.2 0-2.3 0-3.5 0-3.2 0.9-6.4 2-9.4 1.2-2.3 2.6-4.7 4.7-6.4 3.2-2.9 6.7-5 11.1-5.9C53.5 0.3 55 0 56.7 0c1.5 0 2.9 0 4.4 0 2.9 0 5.6 0.6 7.9 1.8 2.6 1.2 5 2.6 6.7 4.4 3.2 3.2 5.3 6.7 6.4 11.1 0.3 1.5 0.6 3.2 0.6 4.7 0 1.2 0 2.3 0 3.2 0 1.5-1.2 2.6-2.6 2.9s-2.9-0.9-3.2-2.3c0-0.3 0-0.3 0-0.6 0-1.2 0-2.6 0-3.8 0-2.3-0.6-4.4-1.8-6.4 -1.5-3.2-4.1-5.9-7.3-7.3 -1.8-0.9-3.5-1.8-5.9-1.8C61.1 5.9 59.1 5.9 59.1 5.9L59.1 5.9z"></path>
            <text x="58.5" y="77" dy=".35em" textAnchor="middle" className="puciUO" data-hook="items-count">{cart.length}</text>
          </svg>
        </div>
      </button>
      <nav data-role="text_nav">
        <Link href="/">About</Link>
        <Link href="/">Toys</Link>
        <Link href="/t-shirts">Cloud Acronym Collective</Link>
        <Link href="/ciso-candles">CISO Candles</Link>
        <Link href="/ciso-coffee">CISO Coffee</Link>
      </nav>
    </header>
  );
};

export default Header;