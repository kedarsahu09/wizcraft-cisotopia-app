// components/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer>
      <section data-role="top_footer">
        <div data-role="connect_section">
          <span><Link href="#">Made with 💖 by WIZ</Link></span>
          <span><Link href="#">Talk about it on Twitter</Link></span>
          <span><Link href="#">Join the conversation on Linkedin</Link></span>
        </div>
        <div data-role="footer_logo">
          <img src="/images/logo.svg" alt="Footer Logo" />
        </div>
      </section>
      <div data-role="made">
        <span>Made with love by <Link href="#">Wiz</Link></span>
        <span><Link href="#">Privacy Policy</Link></span>
      </div>
    </footer>
  );
};

export default Footer;