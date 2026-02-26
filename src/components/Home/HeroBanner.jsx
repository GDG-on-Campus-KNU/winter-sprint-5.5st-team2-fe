import React from 'react';
import styles from './HeroBanner.module.css';
import ProductGrid from '../common/ProductGrid';
import Skeleton from '../common/skeleton/Skeleton';

export default function HeroBanner({
  imageSrc,
  title,
  subtitle,
  sectionTitle,
  onClick,
  isLoading,
}) {
  const mockProducts = [
    {
      id: 1,
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
  ];

  return (
    <div className={styles.heroWrap}>
      <section
        className={styles.promoSection}
        onClick={!isLoading ? onClick : undefined}
      >
        {isLoading ? (
          <Skeleton width="100%" height="100%" borderRAdius="12px" />
        ) : (
          <>
            <img className={styles.image} src={imageSrc} alt={title} />
            <div className={styles.overlay}>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.subtitle}>{subtitle}</p>
            </div>
          </>
        )}
      </section>

      <div className={styles.rightArea}>
        {isLoading ? (
          <Skeleton width="60%" height="38px" borderRadius="4px" />
        ) : (
          <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
        )}
        <ProductGrid
          products={mockProducts}
          variant="featured"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
