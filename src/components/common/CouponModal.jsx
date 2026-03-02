import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './CouponModal.module.css';
import CouponListItem from './CouponListItem';

const FILTER_LABEL = {
  AVAILABLE: '사용가능 쿠폰',
  USED: '사용한 쿠폰',
};

export default function CouponModal({
  open,
  onClose,
  coupons = [],
  selectedCouponId = null,
  onSelectCoupon,
  selectable = true,
}) {
  const [filter, setFilter] = useState('AVAILABLE');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (open) setIsMenuOpen(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const filteredCoupons = useMemo(() => {
    if (filter === 'AVAILABLE') return coupons.filter((c) => !c.isUsed);
    return coupons.filter((c) => c.isUsed);
  }, [coupons, filter]);

  if (!open) return null;

  const onClickOverlay = () => onClose?.();
  const stop = (e) => e.stopPropagation();

  return createPortal(
    <div
      className={styles.overlay}
      onClick={onClickOverlay}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={stop}>
        <header className={styles.header}>
          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.dropdownBtn}
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={isMenuOpen}
            >
              <span className={styles.dropdownText}>
                {FILTER_LABEL[filter]}
              </span>
              <span className={styles.chevron}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>

            {isMenuOpen && (
              <div className={styles.menu} role="listbox">
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => {
                    setFilter('AVAILABLE');
                    setIsMenuOpen(false);
                  }}
                >
                  사용가능 쿠폰
                </button>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => {
                    setFilter('USED');
                    setIsMenuOpen(false);
                  }}
                >
                  사용한 쿠폰
                </button>
              </div>
            )}
          </div>

          <button
            className={styles.closeBtn}
            type="button"
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </header>

        <div className={styles.body}>
          {filteredCoupons.length === 0 ? (
            <div className={styles.empty}>해당 쿠폰이 없습니다.</div>
          ) : (
            <ul className={styles.list}>
              {filteredCoupons.map((c) => (
                <CouponListItem
                  key={c.id}
                  coupon={c}
                  disabled={Boolean(c.isUsed)}
                  isSelected={String(c.id) === String(selectedCouponId)}
                  selectable={selectable}
                  onSelect={() => onSelectCoupon?.(c)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
