// components/Hero.tsx
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <img src="/images/backdrop.avif" className="backdrop" alt="Backdrop" />
      <img src="/images/logo.svg" className="inner_logo" alt="Inner Logo" />
      <img src="/images/cloud_left.svg" className="cloud_left" alt="Cloud Left" />
      <img src="/images/cloud_right.svg" className="cloud_right" alt="Cloud Right" />
    </section>
  );
};

export default Hero;