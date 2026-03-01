import React, { useState, useEffect } from 'react';
import styles from './ProductManage.module.css';
import Skeleton from '../../components/common/skeleton/Skeleton';
import { MOCK_ADMIN_PRODUCTS } from '../../mocks/products';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

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
        //mock데이터로 연동
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProducts(MOCK_ADMIN_PRODUCTS);
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

        <main className={styles.formCard} style={{ flexDirection: 'column' }}>
          <div
            className={styles.topButtons}
            style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}
          >
            <button
              className={styles.outlineBtn}
              style={{
                flex: 1,
                height: '50px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                background: '#fff',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/mypage/admin/product_form')}
            >
              상품 등록
            </button>
            <button
              className={styles.outlineBtn}
              style={{
                flex: 1,
                height: '50px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                background: '#fff',
                cursor: 'pointer',
              }}
              onClick={handleEdit}
            >
              상품 정보 수정
            </button>
          </div>

          <section className={styles.listSection}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '15px',
              }}
            >
              등록 상품
            </h2>

            {/* 리스트 외곽선 */}
            <div
              className={styles.productListBorderBox}
              style={{ borderTop: '1px solid #eee' }}
            >
              {isLoading
                ? // 스켈레톤 로직
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '20px',
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      <Skeleton width="100%" height="120px" />
                    </div>
                  ))
                : products.map((product) => (
                    <div
                      key={product.id}
                      className={styles.productItem}
                      style={{
                        display: 'flex',
                        padding: '20px',
                        borderBottom: '1px solid #eee',
                        gap: '20px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <input
                          type="checkbox"
                          checked={selectedProductId === product.id}
                          onChange={() => handleCheck(product.id)}
                          style={{
                            width: '18px',
                            height: '18px',
                            marginTop: '5px',
                          }}
                        />
                        <div
                          style={{
                            width: '100px',
                            height: '100px',
                            backgroundColor: '#eee',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                              width: '100%;',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      </div>

                      <div className={styles.itemInfo}>
                        <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>
                          {product.name}
                        </p>
                        <p
                          style={{
                            fontSize: '12px',
                            color: '#999',
                            textDecoration: 'line-through',
                            margin: '0',
                          }}
                        >
                          {product.originalPrice?.toLocaleString()}원
                        </p>
                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            margin: '0 0 10px 0',
                          }}
                        >
                          {product.discountPrice?.toLocaleString()}원
                        </p>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '3px 8px',
                              border: '1px solid #eee',
                              borderRadius: '4px',
                            }}
                          >
                            옵션 / 사이즈
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '3px 8px',
                              border: '1px solid #eee',
                              borderRadius: '4px',
                            }}
                          >
                            재고: {product.stock}개
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
  );
}
