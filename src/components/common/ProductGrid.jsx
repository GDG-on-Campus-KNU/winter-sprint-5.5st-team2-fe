import React from 'react';
import styles from './ProductGrid.module.css';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products = [],
  variant = 'grid',
  onCardClick,
}) {
  const VARIANTS = {
    grid: styles.grid,
    featured: styles.featured,
  };
  const variantClass = VARIANTS[variant] || styles.grid;

  if (!products.length) return null;

  return (
    <section className={variantClass}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          onClick={onCardClick}
        />
      ))}
    </section>
  );
}
