// components/SideCart.tsx
'use client';

import React, { useState } from 'react';
import { useCart } from './CartContext';
import Link from 'next/link';

const SideCart: React.FC = () => {
  const { cart, removeItem, closeCart, isOpen } = useCart();
  const [promoShowing, setPromoShowing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: string; discountAmount: number } | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:4000';

  const subtotal = cart.reduce((sum, item) => sum + item.price_int, 0);

  // Calculate discount based on promo type
  const calculateDiscount = (subtotal: number, discountType: string) => {
    if (!discountType) return 0;

    if (discountType.endsWith('%')) {
      const percentage = parseFloat(discountType);
      return subtotal * (percentage / 100);
    }

    if (discountType === 'Buy1Get1') {
      return subtotal * 0.5;
    }

    if (discountType === 'Free Shipping') {
      return 10;
    }

    return 0;
  };

  const discount = appliedPromo ? calculateDiscount(subtotal, appliedPromo.discount) : 0;
  const total = subtotal - discount;

  const togglePromo = () => setPromoShowing(!promoShowing);

  const submitPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(false);

    if (!promoCode.trim()) {
      setPromoError(true);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/promo/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: promoCode.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setAppliedPromo({
          code: data.code,
          discount: data.discount,
          discountAmount: data.discountAmount
        });
        setPromoCode('');
        setPromoShowing(false);
        setPromoError(false);
      } else {
        setPromoError(true);
      }
    } catch (error) {
      console.error('Promo error:', error);
      setPromoError(true);
    }
  };

  const removePromo = async () => {
    try {
      await fetch(`${baseUrl}/promo/remove`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setAppliedPromo(null);
    } catch (error) {
      console.error('Error removing promo:', error);
    }
  };
  const buyNow = () => {
    console.log('buy now');
    closeCart();
    window.location.pathname = '/cart-page';
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close cart if clicking on the overlay (not the cart itself)
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          data-role="cart_overlay"
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}
      <aside data-role="side_cart" data-showing={isOpen ? 'showing' : 'not_showing'}>
        <div data-role="side_cart_header">
          <svg onClick={closeCart} viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="sOnyBDt">
            <path fillRule="evenodd" d="M19.2928932,3.99989322 L20,4.707 L12.7068932,11.9998932 L20,19.2928932 L19.2928932,20 L11.9998932,12.7068932 L4.707,20 L3.99989322,19.2928932 L11.2928932,11.9998932 L3.99989322,4.707 L4.707,3.99989322 L11.9998932,11.2928932 L19.2928932,3.99989322 Z"></path>
          </svg>
          <span><em>Cart</em> ({cart.length} items)</span>
        </div>
        {cart.length === 0 ? (
          <section data-role="empty_cart">
            <img src="/images/cart.svg" alt="Empty Cart" />
            <p>Your cart is empty</p>
            <div data-role="continue_shopping" onClick={closeCart}>Continue Shopping</div>
          </section>
        ) : (
          <section data-role="product_list_wrapper">
            {cart.map((item) => (
              <div key={item.id_str} data-role="cart_item" data-cart_item_id={item.id_str}>
                <Link href={`/product-page/${item.id_str}`}>
                  <img data-role="cart_image" src={item.image_str} alt={item.name_str} />
                </Link>
                <span data-role="cart_item_name">{item.name_str}</span>
                <span data-role="cart_item_price">{item.price_int.toFixed(2)}$</span>
                <svg data-role="cart_delete" onClick={() => removeItem(item.id_str)} viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path fillRule="evenodd" d="M13.5,3 C14.327,3 15,3.673 15,4.5 L15,4.5 L15,5 L19,5 L19,6 L18,6 L18,17.5 C18,18.879 16.878,20 15.5,20 L15.5,20 L7.5,20 C6.122,20 5,18.879 5,17.5 L5,17.5 L5,6 L4,6 L4,5 L8,5 L8,4.5 C8,3.673 8.673,3 9.5,3 L9.5,3 Z M17,6 L6,6 L6,17.5 C6,18.327 6.673,19 7.5,19 L7.5,19 L15.5,19 C16.327,19 17,18.327 17,17.5 L17,17.5 L17,6 Z M10,9 L10,16 L9,16 L9,9 L10,9 Z M14,9 L14,16 L13,16 L13,9 L14,9 Z M13.5,4 L9.5,4 C9.224,4 9,4.225 9,4.5 L9,4.5 L9,5 L14,5 L14,4.5 C14,4.225 13.776,4 13.5,4 L13.5,4 Z"></path>
                </svg>
              </div>
            ))}
            <div data-role="enter_promo_code_wrapper">
              <svg data-role="enter_promo_code_svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M19,11.7071068 L11.2071068,19.5 C10.8165825,19.8905243 10.1834175,19.8905243 9.79289322,19.5 L4.5,14.2071068 C4.10947571,13.8165825 4.10947571,13.1834175 4.5,12.7928932 L12.2928932,5 L19,5 L19,11.7071068 Z M18,6 L12.7071068,6 L5.20710678,13.5 L10.5,18.7928932 L18,11.2928932 L18,6 Z M15,10 C14.4477153,10 14,9.55228475 14,9 C14,8.44771525 14.4477153,8 15,8 C15.5522847,8 16,8.44771525 16,9 C16,9.55228475 15.5522847,10 15,10 Z"></path>
              </svg>
              {!appliedPromo ? (
                <>
                  <span data-role="enter_promo_code_link" onClick={togglePromo}>Enter a promo code</span>
                  <form data-showing={promoShowing ? 'showing' : 'not_showing'} data-role="promo_code_container" onSubmit={submitPromo}>
                    <input
                      data-role="promo_input"
                      type="text"
                      placeholder="e.g., SAVE50"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <input
                      data-role="promo_input_btn"
                      type="submit"
                      value="Apply"
                      style={promoCode.trim() ? { background: '#0254ec', cursor: 'pointer' } : {}}
                    />
                    <div data-role="invalid_wrapper" data-showing={promoError ? 'showing' : 'not_showing'}>
                      <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" className="sp3zeVN" aria-hidden="true">
                        <path fillRule="evenodd" d="M9.5,3 C13.084,3 16,5.916 16,9.5 C16,13.084 13.084,16 9.5,16 C5.916,16 3,13.084 3,9.5 C3,5.916 5.916,3 9.5,3 Z M9.5,4 C6.467,4 4,6.467 4,9.5 C4,12.533 6.467,15 9.5,15 C12.533,15 15,12.533 15,9.5 C15,6.467 12.533,4 9.5,4 Z M10,11 L10,12 L9,12 L9,11 L10,11 Z M10,7 L10,10 L9,10 L9,7 L10,7 Z"></path>
                      </svg>
                      <span>Promo code isn't valid.</span>
                    </div>
                  </form>
                </>
              ) : (
                <div data-role="applied_promo_wrapper">
                  <span data-role="applied_promo_code">
                    {appliedPromo.code} ({appliedPromo.discount})
                  </span>
                  <span data-role="remove_promo" onClick={removePromo} style={{ cursor: 'pointer', marginLeft: '8px', color: '#999' }}>
                    ✕
                  </span>
                </div>
              )}
            </div>
          </section>
        )}
        <div data-role="enter_promo_code_container">
          <div data-role="cart_estimated_wrapper">
            {appliedPromo && (
              <>
                <div data-role="estimated_total_top">
                  <span>Subtotal</span>
                  <span data-role="estimated_price">{subtotal.toFixed(2)}$</span>
                </div>
                <div data-role="estimated_total_top">
                  <span>Discount ({appliedPromo.discount})</span>
                  <span data-role="estimated_price" style={{ color: '#28a745' }}>-{discount.toFixed(2)}$</span>
                </div>
              </>
            )}
            <div data-role="estimated_total_top">
              <span>Estimated total</span>
              <span data-role="estimated_price">{total.toFixed(2)}$</span>
            </div>
            <span data-role="taxes">Taxes and shipping are calculated at checkout.</span>
            <a href="/cart-page">
              <span data-role="buy_now" onClick={buyNow}>BUY NOW</span>
            </a>
            <span data-role="secure_checkout">
              <svg width="11" height="14" viewBox="0 0 11 14" xmlns="http://www.w3.org/2000/svg" className="QXycij" data-hook="SecureCheckoutDataHook.lock">
                <g fill="currentColor" fillRule="evenodd">
                  <path d="M0 12.79c0 .558.445 1.01.996 1.01h9.008A1 1 0 0 0 11 12.79V6.01c0-.558-.445-1.01-.996-1.01H.996A1 1 0 0 0 0 6.01v6.78Z"></path>
                  <path d="M9.5 5v-.924C9.5 2.086 7.696.5 5.5.5c-2.196 0-4 1.586-4 3.576V5h1v-.924c0-1.407 1.33-2.576 3-2.576s3 1.17 3 2.576V5h1Z" fillRule="nonzero"></path>
                </g>
              </svg>
              <span>Secure Checkout</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideCart;