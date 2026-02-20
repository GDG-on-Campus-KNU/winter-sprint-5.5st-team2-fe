import React from 'react';
import styles from './ProductDetailImages.module.css';

function ProductDetailImages({ images = [], name = '상품' }) {
  if (!images.length) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>상품 상세 정보</h2>
      <div className={styles.imageList}>
        {images.map((imageUrl, index) => (
          <img
            key={`${imageUrl}-${index}`}
            src={imageUrl}
            alt={`${name} 상세 이미지 ${index + 1}`}
            className={styles.detailImage}
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}

export default ProductDetailImages;
