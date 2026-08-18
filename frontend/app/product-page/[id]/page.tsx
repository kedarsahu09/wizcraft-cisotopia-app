// app/product-page/[id]/page.tsx
import Header from '../../../components/Header';
import DetailsInner from '../../../components/DetailsInner';
import SideCart from '../../../components/SideCart';
import Footer from '../../../components/Footer';

export const metadata = {
  title: 'Product Page | CISOtopia',
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <link rel="stylesheet" href="/styles/header.css" />
      <link rel="stylesheet" href="/styles/side_cart.css" />
      <link rel="stylesheet" href="/styles/product.css" />
      <link rel="stylesheet" href="/styles/details.css" />
      <link rel="stylesheet" href="/styles/above_the_footer.css" />
      <link rel="stylesheet" href="/styles/footer.css" />
      <Header />
      <DetailsInner id={id} />
      <SideCart />
      <Footer />
    </>
  );
}