import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../component/Home/HeroBanner';
import BannerImg from '../assets/BannerImage.png';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <HeroBanner
        imageSrc={BannerImg}
        title="New Collection"
        sectionTitle="새로운 S/S 시즌을 경험하다"
        onClick={() => navigate('/event/ss')}
      />
    </div>
  );
}
