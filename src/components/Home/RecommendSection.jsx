import React from 'react';
import styles from './RecommendSection.module.css';
import ProductGrid from '../common/ProductGrid';
import Pagination from '../common/Pagination';
import Skeleton from '../../components/common/skeleton/Skeleton';

const SORT_OPTIONS = [
  { value: 'Oldest', label: '오래된순' },
  { value: 'Newest', label: '최신순' },
];

export default function RecommendSection({
  title = '오늘 들어온 상품',
  products = [],
  sort = 'Newest',
  onSortChange,
  page,
  totalPages,
  onPageChange,
  onCardClick,
  isLoading,
}) {
  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <>
          {isLoading ? (
            <Skeleton width="10%" height="29px" borderRadius="4px" />
          ) : (
            <h2 className={styles.title}>{title}</h2>
          )}
        </>

        <select
          className={styles.select}
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <ProductGrid
        products={products}
        variant="grid"
        onCardClick={onCardClick}
        isLoading={isLoading}
      />

      <div className={styles.paginationRow}>
        {!isLoading && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </section>
  );
}
