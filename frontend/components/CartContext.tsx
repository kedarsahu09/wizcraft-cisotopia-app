// components/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id_str: string;
  price_int: number;
  old_price_int: number;
  image_str: string;
  name_str: string;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addItem: () => {},
  removeItem: () => {},
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cart_str');
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  const addItem = (item: CartItem) => {
    const newCart = [...cart, item];
    setCart(newCart);
    localStorage.setItem('cart_str', JSON.stringify(newCart));
    openCart();
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item.id_str !== id);
    setCart(newCart);
    localStorage.setItem('cart_str', JSON.stringify(newCart));
  };

  const openCart = () => setIsOpen(true);

  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, isOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);