// app/t-shirts/page.tsx
import Header from '../../components/Header';
import Products from '../../components/Products';
import SideCart from '../../components/SideCart';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Cloud Acronym Collective | CISOtopia',
};

export default function TShirts() {
  return (
    <>
      <link rel="stylesheet" href="/styles/header.css" />
      <link rel="stylesheet" href="/styles/side_cart.css" />
      <link rel="stylesheet" href="/styles/product.css" />
      <link rel="stylesheet" href="/styles/tshirts.css" />
      <link rel="stylesheet" href="/styles/above_the_footer.css" />
      <link rel="stylesheet" href="/styles/footer.css" />
      <Header />
      <div data-role="main_tshirt_image">
        <img src="/images/t.png" alt="T-Shirt" />
      </div>
      <div className="marquee-container">
        <div className="marquee-content">
          <span>LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION </span>
          <span>LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION LIMITED EDITION </span>
        </div>
      </div>
      <SideCart />
      <Products type="tshirts" />
      <Footer />
    </>
  );
}