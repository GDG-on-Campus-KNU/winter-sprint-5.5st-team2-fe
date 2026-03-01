import React, { useState } from 'react';
import CommonCheckbox from '../common/CommonCheckbox';
import styles from './CartItemCard.module.css';

function CartItemCard({
  brand,
  items,
  selectedItemIds,
  isBrandChecked,
  isBrandIndeterminate,
  onBrandCheckedChange,
  onItemCheckedChange,
  onSizeChange,
  onQuantityChange,
  onRemove,
  onOpenCouponModal,
}) {
  const brandCheckboxId = `brand-checkbox-${brand.replace(/\s+/g, '-').toLowerCase()}`;
  const [expandedItemIds, setExpandedItemIds] = useState([]);

  const toggleOptionEditor = (itemId) => {
    setExpandedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  return (
    <article className={styles.card}>
      <div className={styles.brandRow}>
        <CommonCheckbox
          id={brandCheckboxId}
          checked={isBrandChecked}
          indeterminate={isBrandIndeterminate}
          onChange={(isChecked) => onBrandCheckedChange(brand, isChecked)}
        />
        <p className={styles.brand}>{brand}</p>
      </div>

      <div className={styles.itemList}>
        {items.map((item) => {
          const isOptionEditorOpen = expandedItemIds.includes(item.cartItemId);

          return (
            <div className={styles.itemRow} key={item.cartItemId}>
              <div className={styles.itemCheck}>
                <CommonCheckbox
                  id={`item-checkbox-${item.cartItemId}`}
                  checked={selectedItemIds.includes(item.cartItemId)}
                  onChange={(isChecked) =>
                    onItemCheckedChange(item.cartItemId, isChecked)
                  }
                />
              </div>

              <img
                src={item.imageUrl}
                alt={item.name}
                className={styles.image}
              />

              <div className={styles.infoArea}>
                <h2 className={styles.name}>{item.name}</h2>

                <div className={styles.optionSummaryRow}>
                  <p className={styles.optionSummaryText}>
                    옵션: {item.selectedSize} / 수량: {item.quantity}개
                  </p>
                  <div className={styles.buttonGroup}>
                    <button
                      type="button"
                      className={styles.changeButton}
                      onClick={() => toggleOptionEditor(item.cartItemId)}
                    >
                      변경
                    </button>

                    <button
                      type="button"
                      className={styles.couponButton}
                      onClick={() => onOpenCouponModal?.(item.cartItemId)}
                    >
                      쿠폰 적용
                    </button>
                  </div>
                </div>

                {isOptionEditorOpen ? (
                  <div className={styles.optionRow}>
                    <select
                      className={styles.sizeSelect}
                      value={item.selectedSize}
                      onChange={(event) =>
                        onSizeChange(item.cartItemId, event.target.value)
                      }
                      aria-label="옵션 사이즈"
                    >
                      {item.sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>

                    <div className={styles.quantityControl}>
                      <button
                        type="button"
                        className={styles.quantityButton}
                        onClick={() => onQuantityChange(item.cartItemId, -1)}
                        aria-label="수량 감소"
                      >
                        -
                      </button>
                      <span className={styles.quantityValue}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className={styles.quantityButton}
                        onClick={() => onQuantityChange(item.cartItemId, 1)}
                        aria-label="수량 증가"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className={styles.priceArea}>
                <p className={styles.price}>{item.price.toLocaleString()}원</p>
                {item.originalPrice > item.price && (
                  <p className={styles.originalPrice}>
                    {item.originalPrice.toLocaleString()}원
                  </p>
                )}
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => onRemove(item.cartItemId)}
                >
                  삭제
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default CartItemCard;
