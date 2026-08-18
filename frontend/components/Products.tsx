'use client';
// components/Products.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

interface Product {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price: number;
  old_price?: number;
  stock?: number; // Optional
  features: string[];
  images: string[];
  score: number;
  order_index: number;
  category: string;
  labels: string[];
  created_at: string;
  updated_at: string;
}

const Products: React.FC<{ type: 'toys' | 'tshirts' | 'candles' | 'coffee' }> = ({ type }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:4000';

  useEffect(() => {
    fetch(`${baseUrl}/products/${type}`)
      .then((res) => res.json())
      .then(setProducts);
  }, [type, baseUrl]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id_str: product.id,
      price_int: product.price,
      old_price_int: product.old_price || 0,
      image_str: product.images[0],
      name_str: product.name,
    });
  };

  return (
    <section id="product_list">
      <section data-role="product_container" data-cat={type}>
        {products.map((product) => (
          <Link key={product.id} href={`/product-page/${product.id}`}>
            <div data-role="product_item" data-name={product.name} data-image_name={product.images[0]} data-price={product.price} data-old_price={product.old_price || null} data-product_id={product.id} style={{ cursor: 'pointer' }}>
              {product.labels.map((label) => (
                <span key={label} data-role="item_label">{label}</span>
              ))}
              <img data-role="item_image" src={product.images[0]} alt={product.name} />
              {product.images.length > 1 && <img data-role="item_image_2" src={product.images[1]} alt={product.name} />}
              <span data-role="item_name">{product.name}</span>
              <div data-role="item_price_wrapper">
                {product.old_price && <span data-role="old_item_price">{product.old_price.toFixed(2)}$</span>}
                <span data-role="item_price">{product.price.toFixed(2)}$</span>
              </div>
              <div data-role="add_to_cart" data-action="add_to_cart" onClick={(e) => handleAddToCart(product, e)}>Add to Cart</div>
            </div>
          </Link>
        ))}
      </section>
    </section>
  );
};

export default Products;