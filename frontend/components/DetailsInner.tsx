'use client';
// components/DetailsInner.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

const markedownToHtml = (md_str: string | null) => {
  if (!md_str) return '';
  let html_str = md_str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  html_str = html_str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html_str = html_str.replace(/^•\s?(.*)$/gm, "<li>$1</li>");
  html_str = html_str.replace(/(<li>.*<\/li>)(\s*(?!(<li>|$)))/g, "<ul>$1</ul>$2");
  html_str = html_str.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");
  return `<p>${html_str}</p>`;
};

interface DetailsInnerProps {
  id: string;
}

const DetailsInner: React.FC<DetailsInnerProps> = ({ id }) => {
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [currentImg, setCurrentImg] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:4000';

  useEffect(() => {
    if (!id) return;
    fetch(`${baseUrl}/products/${id}`)
      .then((res) => res.json())
      .then((data: Product) => {
        setProduct(data);
        setCurrentImg(data.images[0]);
        const type = data.category === 'Apparel' ? 'tshirts' : data.category === 'Candle' ? 'candles' : data.category === 'Coffee' ? 'coffee' : 'toys';
        fetch(`${baseUrl}/products/${type}`)
          .then((res) => res.json())
          .then(setProductsList);
      });
  }, [id, baseUrl]);

  if (!product) return null;

  const index = productsList.findIndex((p) => p.id === id);
  const prev = index > 0 ? productsList[index - 1].id : null;
  const next = index < productsList.length - 1 ? productsList[index + 1].id : null;

  let categoryDisplay = product.category.toLowerCase();
  let categoryHref = '/';
  if (product.category === 'Apparel') {
    categoryDisplay = 'cloud acronym collective';
    categoryHref = '/t-shirts';
  } else if (product.category === 'Candle') {
    categoryDisplay = 'ciso candles';
    categoryHref = '/ciso-candles';
  } else if (product.category === 'Coffee') {
    categoryDisplay = 'ciso coffee';
    categoryHref = '/ciso-coffee';
  } else {
    categoryDisplay = 'toys';
    categoryHref = '/';
  }

  const breadcrumb = (
    <>
      <Link href={categoryHref}>{categoryDisplay}</Link> &gt; <span>{product.name}</span>
    </>
  );

  const handleAddToCart = () => {
    addItem({
      id_str: product.id,
      price_int: product.price,
      old_price_int: product.old_price || 0,
      image_str: product.images[0],
      name_str: product.name,
    });
  };

  return (
    <>
      <nav data-role="product_nav">
        <span data-role="breadcrumbs">{breadcrumb}</span>
        <div data-role="back_next_wrapper">
          <a href={prev ? `/product-page/${prev}` : '#'} style={prev ? { cursor: 'pointer' } : { opacity: 0.5 }} onClick={(e) => { if (!prev) e.preventDefault(); else router.push(`/product-page/${prev}`); }}>&lt; previous</a> | 
          <a href={next ? `/product-page/${next}` : '#'} style={next ? { cursor: 'pointer' } : { opacity: 0.5 }} onClick={(e) => { if (!next) e.preventDefault(); else router.push(`/product-page/${next}`); }}>next &gt;</a>
        </div>
      </nav>
      <section data-role="product_detail_container">
        {product.images.length > 1 && (
          <aside data-role="detail_thumb_wrapper">
            {product.images.map((img) => (
              <img key={img} onClick={() => setCurrentImg(img)} alt={product.name} src={img} />
            ))}
          </aside>
        )}
        <div data-role="detail_image_wrapper">
          <img src={currentImg} alt={product.name} />
        </div>
        <div data-role="detail_text_wrapper">
          <h1 data-role="detail_name">{product.name}</h1>
          {product.tagline && <span data-role="detail_tagline">{product.tagline}</span>}
          <span data-role="detail_price">{product.price.toFixed(2)}$</span>
          {product.old_price && <span data-role="old_detail_price">{product.old_price.toFixed(2)}$</span>}
          <div data-role="detail_description" dangerouslySetInnerHTML={{ __html: markedownToHtml(product.description) }} />
          <span data-role="add_to_cart_detail" onClick={handleAddToCart}>Add to Cart</span>
        </div>
      </section>
    </>
  );
};

export default DetailsInner;