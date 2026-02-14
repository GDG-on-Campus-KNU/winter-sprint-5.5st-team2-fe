import React, { useState } from 'react';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import CommonButton from '../common/CommonButton';
import styles from './ProductSummary.module.css';

function ProductSummary({
  product,
  sizeOptions = ['S', 'M', 'L', 'XL'],
  isSubmitting = false,
  onAddToCart,
  onBuyNow,
}) {
  const [isWishlist, setIsWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    sizeOptions[1] ?? sizeOptions[0],
  );

  const discountedPrice = Math.round(
    product.originalPrice * (1 - product.discountRate / 100),
  );

  const isSoldOut = product.available === false || Number(product.stock) === 0;
  const isActionDisabled = isSoldOut || isSubmitting;

  return (
    <article className={styles.detailLayout}>
      <div className={styles.imageSection}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className={styles.productImage}
        />
        <button
          type="button"
          onClick={() => setIsWishlist((prev) => !prev)}
          className={styles.wishlistButton}
          aria-label="찜하기"
        >
          <FiHeart
            size={20}
            className={isWishlist ? styles.wishlistActive : styles.wishlistIdle}
          />
        </button>
      </div>

      <div className={styles.content}>
        <p className={styles.brand}>{product.brand}</p>
        <h1 className={styles.name}>{product.name}</h1>

        <div className={styles.priceRow}>
          <span className={styles.discountedPrice}>
            {discountedPrice.toLocaleString()}원
          </span>
          {product.discountRate > 0 && (
            <>
              <span className={styles.discountRate}>
                {product.discountRate}%
              </span>
              <span className={styles.originalPrice}>
                {product.originalPrice.toLocaleString()}원
              </span>
            </>
          )}
        </div>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.optionSection}>
          <p className={styles.optionLabel}>사이즈</p>
          <div className={styles.sizeList}>
            {sizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                className={`${styles.sizeButton} ${selectedSize === size ? styles.sizeButtonSelected : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.optionSection}>
          <p className={styles.optionLabel}>수량</p>
          <div className={styles.quantityControl}>
            <button
              type="button"
              className={styles.quantityButton}
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button
              type="button"
              className={styles.quantityButton}
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <CommonButton
            variant="secondary"
            fullWidth
            disabled={isActionDisabled}
            icon={<FiShoppingCart size={18} />}
            onClick={() => onAddToCart?.({ menuId: product.id, quantity })}
          >
            장바구니 담기
          </CommonButton>
          <CommonButton
            fullWidth
            disabled={isActionDisabled}
            onClick={() => onBuyNow?.({ menuId: product.id, quantity })}
          >
            {isSoldOut ? '품절' : isSubmitting ? '처리 중...' : '구매하기'}
          </CommonButton>
        </div>
      </div>
    </article>
  );
}

export default ProductSummary;
