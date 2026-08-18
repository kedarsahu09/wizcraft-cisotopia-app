// app/cart-page/page.tsx
import Header from '../../components/Header';
import SideCart from '../../components/SideCart';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Cart Page | CISOtopia',
};

export default function CartPage() {
  return (
    <>
      <link rel="stylesheet" href="/styles/header.css" />
      <link rel="stylesheet" href="/styles/side_cart.css" />
      <link rel="stylesheet" href="/styles/product.css" />
      <link rel="stylesheet" href="/styles/cart_page.css" />
      <link rel="stylesheet" href="/styles/above_the_footer.css" />
      <link rel="stylesheet" href="/styles/footer.css" />
      <Header />
      <section data-role="cart_page_wrapper">
        <h1>You found our little secret...</h1>
        <img src="/images/not_real.png" alt="Not Real" />
        <h2>But you can actually get these items for FREE!</h2>
        <p>
          This store started as an April Fools joke, but we liked it too much to let it go! Even though you can&apos;t officially purchase these products, we actually created some of them in real life.
        </p>
        <p>
          Want to get a chance to win an item? Fill in your work email below, and you might become a lucky winner of one of these items - delivered to your doorstep for free!*
        </p>
        <svg data-role="svg_arrow" data-bbox="20.045 51 159.91 98.001" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="20.045 51 159.91 98.001" preserveAspectRatio="xMidYMid meet" data-type="shape" role="presentation" aria-label="">
          <g>
            <path d="M179.222 129.111c-.655-.409-1.555-.164-2.046.491l-8.43 14.078c-9.494-37.323-27.583-63.924-53.856-78.902-42.89-24.391-93.308-9.003-93.799-8.84-.737.246-1.228 1.064-.982 1.801s1.064 1.228 1.801.982c.491-.164 49.764-15.224 91.588 8.676 25.619 14.569 43.216 40.515 52.465 77.101l-14.16-8.021c-.737-.409-1.637-.164-1.964.573-.409.737-.164 1.637.573 1.964l17.188 9.74c.082 0 .082.082.164.082s.082 0 .164.082a.9.9 0 0 0 .408.082h.327q.245 0 .491-.246l.082-.082.327-.327 10.231-17.106c.328-.819.164-1.719-.572-2.128"></path>
          </g>
        </svg>
        <div data-role="email_form">
          <label htmlFor="work_email">Work Email *</label>
          <input data-role="email_input" id="work_email" name="work_email" type="email" placeholder="linda@cybersecurity.com" />
          <p data-role="agree_text">
            I agree that Wiz may contact me for marketing purposes, including to share with me information about its services and products. For more information about how Wiz processes your personal data see <a href="javascript:void(0);">Wiz&apos;s Privacy Policy</a>
          </p>
          <input type="submit" />
        </div>
      </section>
      <SideCart />
      <Footer />
    </>
  );
}