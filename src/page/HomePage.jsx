import React from 'react';
import HeroBanner from '../component/Home/HeroBanner';
import BannerImg from '../assets/BannerImage.png';

export default function HomePage() {
  return (
    <div>
      <HeroBanner
        imageSrc={BannerImg}
        title="New Collection"
        subtitle="새로운 S/S 시즌을 경험하다"
        onClick={() => Navigate('/event/ss')}
      />
    </div>
  );
}
