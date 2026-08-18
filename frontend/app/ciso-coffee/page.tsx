// app/ciso-coffee/page.tsx
import Header from '../../components/Header';
import Products from '../../components/Products';
import SideCart from '../../components/SideCart';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Cloud Acronym Collective | CISOtopia',
};

export default function Coffee() {
  return (
    <>
      <link rel="stylesheet" href="/styles/header.css" />
      <link rel="stylesheet" href="/styles/side_cart.css" />
      <link rel="stylesheet" href="/styles/product.css" />
      <link rel="stylesheet" href="/styles/coffee.css" />
      <link rel="stylesheet" href="/styles/above_the_footer.css" />
      <link rel="stylesheet" href="/styles/footer.css" />
      <Header />
      <div data-role="main_coffee_image">
        <img src="/images/ciso-coffee.png" alt="Coffee" />
      </div>
      <div className="marquee-container">
        <div className="marquee-content">
          <span>NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ </span>
          <span>NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ NEW ☕ </span>
        </div>
      </div>
      <SideCart />
      <Products type="coffee" />
      <Footer />
    </>
  );
}