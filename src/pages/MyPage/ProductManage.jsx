import React, { useState, useEffect } from 'react';
import styles from './ProductManage.module.css';
import Skeleton from '../../components/common/skeleton/Skeleton';
import { MOCK_ADMIN_PRODUCTS } from '../../mocks/products';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import CommonCheckbox from '../../components/common/CommonCheckbox';

export default function ProductManage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = useToast();
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const savedProducts = localStorage.getItem('admin_products');

        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 800));
          setProducts(MOCK_ADMIN_PRODUCTS);
          localStorage.setItem(
            'admin_products',
            JSON.stringify(MOCK_ADMIN_PRODUCTS),
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCheck = (id) => {
    setSelectedProductId((prev) => (prev === id ? null : id));
  };

  const handleEdit = () => {
    if (!selectedProductId) {
      showToast('수정할 상품을 선택해주세요.', 'error');
      return;
    }
    navigate(`/mypage/admin/product_edit/${selectedProductId}`);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <aside className={styles.sideTitle}>
          <h1>마이페이지</h1>
          <h2>- 상품 관리</h2>
        </aside>

        <div className={styles.contentSection}>
          <div className={styles.topButtons}>
            <button
              className={styles.outlineBtn}
              onClick={() => navigate('/mypage/admin/product_form')}
            >
              상품 등록
            </button>
            <button className={styles.outlineBtn} onClick={handleEdit}>
              상품 정보 수정
            </button>
          </div>

          <main className={styles.formCard}>
            <section className={styles.listSection}>
              <h2 className={styles.listTitle}>등록 상품</h2>

              <div className={styles.productListBorderBox}>
                {isLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className={styles.skeletonWrapper}>
                        <Skeleton width="100%" height="120px" />
                      </div>
                    ))
                  : products.map((product) => (
                      <div key={product.id} className={styles.productItem}>
                        <div className={styles.itemLeftGroup}>
                          <CommonCheckbox
                            id={`product-${product.id}`}
                            checked={selectedProductId === product.id}
                            onChange={() => handleCheck(product.id)}
                          />
                          <div className={styles.imgBox}>
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className={styles.productImg}
                            />
                          </div>
                        </div>

                        <div className={styles.itemInfo}>
                          <p className={styles.name}>{product.name}</p>
                          <p className={styles.oldPrice}>
                            {product.originalPrice?.toLocaleString()}원
                          </p>
                          <p className={styles.price}>
                            {product.discountPrice?.toLocaleString()}원
                          </p>
                          <p className={styles.delivery}>배송비</p>
                          <div className={styles.badgeGroup}>
                            <span className={styles.badge}>옵션 / 사이즈</span>
                            <span className={styles.badge}>
                              남은 재고 : {product.stock}개
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
