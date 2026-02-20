import React from 'react';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, variant = 'grid', onClick }) {
  if (!product) return null;

  const { imageUrl, brand, name, discountRate, price } = product;
  const VARIANTS = { grid: styles.grid, featured: styles.featured };

  const variantClass = VARIANTS[variant] || styles.grid;

  return (
    <article
      className={`${styles.card} ${variantClass}`}
      onClick={() => onClick?.(product)}
    >
      <div className={styles.thumbWrap}>
        <img src={imageUrl} alt={`${brand} ${name}`} className={styles.thumb} />
      </div>

      <div className={styles.meta}>
        <div className={styles.brand}>{brand}</div>

        <div className={styles.name}>{name}</div>

        <div className={styles.priceRow}>
          <span className={styles.discount}>{discountRate}%</span>
          <span className={styles.price}>{price.toLocaleString()}원</span>
        </div>
      </div>
    </article>
  );
}
