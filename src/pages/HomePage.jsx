import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/Home/HeroBanner';
import BannerImg from '../assets/BannerImage.png';
import RecommendSection from '../components/Home/RecommendSection';
import { mockMenuList } from '../mocks/menus.mock';

export default function HomePage() {
  const navigate = useNavigate();

  const [sort, setSort] = useState('recommend');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  //api 연동 전 임시 로직 
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); 
    return () => clearTimeout(timer);
  }, [page, sort]); 

  const recommendProducts = useMemo(
    () =>
      mockMenuList.map((menu) => ({
        id: menu.id,
        imageUrl: menu.imageUrl,
        brand: menu.brand,
        name: menu.name,
        discountRate: menu.discountRate,
        price: menu.price,
      })),
    [],
  );

  const totalPages = 5;

  return (
    <div>
      <HeroBanner
        imageSrc={BannerImg}
        title="New Collection"
        sectionTitle="새로운 S/S 시즌을 경험하다"
        onClick={() => navigate('/event/ss')}
        isLoading = {isLoading}
      />

      <RecommendSection
        title="오늘 들어온 상품"
        products={recommendProducts}
        isLoading = {isLoading}
        sort={sort}
        onSortChange={(nextSort) => {
          setSort(nextSort);
          setPage(1);
        }}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onCardClick={(product) => navigate(`/products/${product.id}`)}
      />
    </div>
  );
}
