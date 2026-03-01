import React, { useEffect, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiShoppingCart,
} from 'react-icons/fi';
import CommonButton from '../common/CommonButton';
import styles from './ProductSummary.module.css';
import Skeleton from '../../components/common/skeleton/Skeleton';

function ProductSummary({
  product,
  isSubmitting = false,
  onAddToCart,
  onBuyNow,
  isLoading,
}) {
  const sizeOptions = product.sizes?.length ? product.sizes : [];
  if (isLoading) {
    return (
      <article className={styles.detailLayout}>
        <div className={styles.imageSection}>
          <Skeleton width="100%" height="100%" borderRadius="12px" />
        </div>

        <div className={styles.content}>
          <Skeleton width="30%" height="14px" />
          <Skeleton width="20%" height="14px" />
          <Skeleton width="100%" height="32px" className={styles.name} />
          <Skeleton width="50%" height="24px" />
          <div style={{ marginTop: '20px' }}>
            <Skeleton width="100%" height="100px" />
          </div>
          <div className={styles.actionButtons} style={{ marginTop: 'auto' }}>
            <Skeleton width="100%" height="48px" borderRadius="8px" />
            <Skeleton width="100%" height="48px" borderRadius="8px" />
          </div>
        </div>
      </article>
    );
  }
  const galleryImages =
    product.galleryImages?.length > 0
      ? product.galleryImages
      : [product.imageUrl];
  const defaultSize = sizeOptions[0] ?? '';
  const colorName = product.color ?? '기본';
  const colorHex = product.colorHex ?? '#111111';

  const [isWishlist, setIsWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setSelectedSize(defaultSize);
  }, [defaultSize]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product.id]);

  const discountedPrice = Math.round(
    product.originalPrice * (1 - product.discountRate / 100),
  );

  const isSoldOut = product.available === false || Number(product.stock) === 0;
  const isSizeUnavailable = sizeOptions.length === 0;
  const isActionDisabled = isSoldOut || isSizeUnavailable || isSubmitting;

  return (
    <article className={styles.detailLayout}>
      <div className={styles.imageSection}>
        <img
          src={galleryImages[currentImageIndex]}
          alt={product.name}
          className={styles.productImage}
        />
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.carouselButton} ${styles.carouselButtonLeft}`}
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? galleryImages.length - 1 : prev - 1,
                )
              }
              aria-label="이전 이미지"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              type="button"
              className={`${styles.carouselButton} ${styles.carouselButtonRight}`}
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === galleryImages.length - 1 ? 0 : prev + 1,
                )
              }
              aria-label="다음 이미지"
            >
              <FiChevronRight size={20} />
            </button>
            <div className={styles.carouselDots}>
              {galleryImages.map((image, index) => (
                <span
                  key={`${image}-${index}`}
                  className={`${styles.carouselDot} ${index === currentImageIndex ? styles.carouselDotActive : ''}`}
                />
              ))}
            </div>
          </>
        )}
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
        <p className={styles.category}>{product.category}</p>
        <p className={styles.rating}>★ {product.rating.toFixed(1)}</p>
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
          <p className={styles.optionLabel}>컬러</p>
          <div className={styles.colorTag}>
            <span
              className={styles.colorSwatch}
              style={{ backgroundColor: colorHex }}
              aria-hidden="true"
            />
            <span>{colorName}</span>
          </div>
        </div>

        <div className={styles.optionSection}>
          <p className={styles.optionLabel}>사이즈</p>
          <select
            className={styles.sizeSelect}
            value={selectedSize}
            disabled={isSizeUnavailable}
            onChange={(event) => setSelectedSize(event.target.value)}
          >
            {isSizeUnavailable ? (
              <option value="">사이즈 없음</option>
            ) : (
              sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))
            )}
          </select>
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
            onClick={() =>
              onAddToCart?.({
                productId: product.id,
                quantity,
                selectedSize,
              })
            }
          >
            장바구니 담기
          </CommonButton>
          <CommonButton
            fullWidth
            disabled={isActionDisabled}
            onClick={() =>
              onBuyNow?.({
                productId: product.id,
                quantity,
                selectedSize,
              })
            }
          >
            {isSoldOut ? '품절' : isSubmitting ? '처리 중...' : '구매하기'}
          </CommonButton>
        </div>
      </div>
    </article>
  );
}

export default ProductSummary;
