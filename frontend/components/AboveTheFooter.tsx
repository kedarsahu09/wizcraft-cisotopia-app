// components/AboveTheFooter.tsx
import React from 'react';

const AboveTheFooter: React.FC = () => {
  return (
    <section data-role="above_footer_home">
      <section data-role="start_now_button">
        <img data-role="above_footer_hunt" src="/images/hunt.png" alt="Hunt" />
        <div>
          <a href="https://www.wiz.io/events/the-ciso-treasure-hunt-rsac-2025">Start Now</a>
        </div>
      </section>
      <img data-role="above_footer_twister" src="/images/twister1.png" alt="Twister" />
    </section>
  );
};

export default AboveTheFooter;