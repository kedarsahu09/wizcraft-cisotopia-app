// app/ciso-candles/page.tsx
import Header from '../../components/Header';
import Products from '../../components/Products';
import SideCart from '../../components/SideCart';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'CISO candles | CISOtopia',
};

export default function CisoCandles() {
  return (
    <>
      <link rel="stylesheet" href="/styles/header.css" />
      <link rel="stylesheet" href="/styles/side_cart.css" />
      <link rel="stylesheet" href="/styles/product.css" />
      <link rel="stylesheet" href="/styles/candles.css" />
      <link rel="stylesheet" href="/styles/above_the_footer.css" />
      <link rel="stylesheet" href="/styles/footer.css" />
      <Header />
      <div data-role="main_candles_image">
        <img src="/images/candles_large.png" alt="CISO Candles" />
      </div>
      <Products type="candles" />
      <SideCart />
      <Footer />
    </>
  );
}