import React from 'react';
import styles from './RecommendSection.module.css';
import ProductGrid from '../common/ProductGrid';
import Pagination from '../common/Pagination';

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
}) {
  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>{title}</h2>

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
      />

      <div className={styles.paginationRow}>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
}
