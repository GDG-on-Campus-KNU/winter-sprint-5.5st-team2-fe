import React, { useState, useEffect } from 'react';
import styles from './ProductForm.module.css'; 
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_ADMIN_PRODUCTS } from '../../mocks/products';
import { useToast } from '../../context/ToastContext';

export default function ProductEdit() {
  const { productId } = useParams(); 
  const navigate = useNavigate();
  const showToast = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    discountRate: '',
    discountPrice: '',
    stock: '',
    option: '',
    size: '',
    imageUrl: null
  });

  useEffect(() => {
    const targetProduct = MOCK_ADMIN_PRODUCTS.find(p => p.id === Number(productId));
    
    if (targetProduct) {
      setFormData({
        ...targetProduct,
        discountRate: targetProduct.discountRate || 0 
      });
    } else {
      showToast('해당 상품을 찾을 수 없습니다.', 'error');
      navigate('/admin/product');
    }
  }, [productId]);

  useEffect(() => {
    const price = Number(formData.originalPrice);
    const rate = Number(formData.discountRate);
    
    if (price && rate >= 0) {
      const calculated = price * (1 - rate / 100);
      setFormData(prev => ({ ...prev, discountPrice: Math.floor(calculated) }));
    }
  }, [formData.originalPrice, formData.discountRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  
  const index = MOCK_ADMIN_PRODUCTS.findIndex(p => p.id === Number(productId));
  if (index !== -1) {
    MOCK_ADMIN_PRODUCTS[index] = { ...formData, id: Number(productId) };
  }

  showToast('상품 정보가 성공적으로 수정되었습니다.', 'success');
  navigate('/mypage/admin/product_manage'); 
};

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.sideTitle}>
          <h1>마이페이지</h1>
          <h2>- 상품 관리</h2>
          <h2 className={styles.highlight}>- 상품 정보 수정</h2>
        </div>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.imageUploadSection}>
            <label className={styles.imageLabel}>
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              <div className={styles.imagePlaceholder}>
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="상품 이미지" />
                ) : (
                  <span className="material-icons">camera_alt</span>
                )}
              </div>
            </label>
          </div>

          <div className={styles.inputSection}>
            <div className={styles.inputGroup}>
              <label>상품명 입력</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="상품명이 기존에 입력되어 있어야 합니다!" 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>가격 입력</label>
              <div className={styles.withUnit}>
                <input 
                  type="number" 
                  name="originalPrice" 
                  value={formData.originalPrice} 
                  onChange={handleChange} 
                  placeholder="가격이 기존에 입력되어 있어야 합니다!" 
                />
                <span>원</span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>할인율 입력</label>
              <div className={styles.withUnit}>
                <input 
                  type="number" 
                  name="discountRate" 
                  value={formData.discountRate} 
                  onChange={handleChange} 
                  placeholder="할인율을 입력하세요" 
                />
                <span>%</span>
              </div>
              <div className={styles.withUnit} style={{ marginTop: '8px' }}>
                <input 
                  type="text" 
                  value={formData.discountPrice?.toLocaleString()} 
                  readOnly 
                  placeholder="할인된 가격" 
                />
                <span>원</span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>재고 수량 입력</label>
              <div className={styles.withUnit}>
                <input 
                  type="number" 
                  name="stock" 
                  value={formData.stock} 
                  onChange={handleChange} 
                  placeholder="수량이 기존에 입력되어 있어야 합니다!" 
                />
                <span>개</span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>옵션 입력</label>
              <input 
                type="text" 
                name="option" 
                value={formData.option} 
                onChange={handleChange} 
                placeholder="수량이 기존에 입력되어 있어야 합니다!" 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>사이즈 입력</label>
              <input 
                type="text" 
                name="size" 
                value={formData.size} 
                onChange={handleChange} 
                placeholder="사이즈가 기존에 입력되어 있어야 합니다!" 
              />
            </div>

            <button type="submit" className={styles.submitBtn}>등록 완료</button>
          </div>
        </form>
      </div>
    </div>
  );
}