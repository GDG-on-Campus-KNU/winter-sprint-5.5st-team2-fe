import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../component/Home/HeroBanner';
import BannerImg from '../assets/BannerImage.png';
import RecommendSection from '../component/Home/RecommendSection';

export default function HomePage() {
  const navigate = useNavigate();

  const [sort, setSort] = useState('recommend');
  const [page, setPage] = useState(1);

  const recommendProducts = useMemo(
    () => [
      {
        id: 101,
        imageUrl:
          'https://image.msscdn.net/thumbnails/images/goods_img/20250911/5445378/5445378_17586088969585_big.jpg?w=1200',
        brand: '사일프레이',
        name: 'Graphic Zip Up Hoodie / Ivory',
        discountRate: 23,
        price: 113990,
      },
      {
        id: 2,
        imageUrl:
          'https://image.msscdn.net/thumbnails/images/goods_img/20251229/5859932/5859932_17670103254685_big.jpg?w=1200',
        brand: '미드나잇 무브',
        name: 'horse hood zip up (white)',
        discountRate: 25,
        price: 73990,
      },
      {
        id: 3,
        imageUrl:
          'https://image.msscdn.net/thumbnails/images/goods_img/20240117/3800636/3800636_17425227643808_big.jpg?w=1200',
        brand: '게인스보로',
        name: '아플리케 스타로고 후드집업_오트밀',
        discountRate: 51,
        price: 41500,
      },
      {
        id: 4,
        imageUrl:
          'https://image.msscdn.net/thumbnails/images/goods_img/20250122/4738347/4738347_17567941187869_big.jpg?w=1200',
        brand: '피지컬 디파트먼트',
        name: '체크 스타테일 엘보우 패치 후드집업_그레이',
        discountRate: 45,
        price: 49000,
      },
      {
        id: 2,
        imageUrl:
          'https://image.msscdn.net/thumbnails/images/goods_img/20251229/5859932/5859932_17670103254685_big.jpg?w=1200',
        brand: '미드나잇 무브',
        name: 'horse hood zip up (white)',
        discountRate: 25,
        price: 73990,
      },
      {
        id: 5,
        imageUrl:
          'https://image.msscdn.net/thumbnails/images/goods_img/20240117/3800636/3800636_17425227643808_big.jpg?w=1200',
        brand: '게인스보로',
        name: '아플리케 스타로고 후드집업_오트밀',
        discountRate: 51,
        price: 41500,
      },
      {
        id: 6,
        imageUrl:
          'https://image.msscdn.net/thumbnails/images/goods_img/20250122/4738347/4738347_17567941187869_big.jpg?w=1200',
        brand: '피지컬 디파트먼트',
        name: '체크 스타테일 엘보우 패치 후드집업_그레이',
        discountRate: 45,
        price: 49000,
      },
    ],
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
      />

      <RecommendSection
        title="추천 상품"
        products={recommendProducts}
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
