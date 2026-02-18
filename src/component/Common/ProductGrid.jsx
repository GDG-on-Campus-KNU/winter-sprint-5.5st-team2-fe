import React from 'react';
import styles from './ProductGrid.module.css';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products = [],
  variant = 'grid',
  onCardClick,
}) {
  if (!products.length) return null;

  return (
    <section className={styles.grid}>
      {products.map((product, index) => (
        <ProductCard
          key={index}
          product={product}
          variant={variant}
          onClick={onCardClick}
        />
      ))}
    </section>
  );
}
