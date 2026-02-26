import React from 'react';
import styles from './ProductGrid.module.css';
import ProductCard from './ProductCard';
import SkeletonCard from '../../components/common/skeleton/SkeletonCard'

export default function ProductGrid({
  products = [],
  isLoading,
  variant = 'grid',
  onCardClick,
}) {
  const VARIANTS = {
    grid: styles.grid,
    featured: styles.featured,
  };
  const variantClass = VARIANTS[variant] || styles.grid;


  if (isLoading) {

    const skeletonCount = products.length > 0 ? products.length : 8;
    return (

      <section className={variantClass}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
      </section>
    )

  }

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
