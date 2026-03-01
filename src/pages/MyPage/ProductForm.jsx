import React, { useState, useEffect } from 'react';
import styles from './ProductForm.module.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountRate: '',
    discountedPrice: '',
    stock: '',
    option: '',
    size: '',
    imageUrl: null,
  });

  useEffect(() => {
    const price = Number(formData.price);
    const rate = Number(formData.discountRate);

    if (price && rate >= 0) {
      const calculated = price * (1 - rate / 100);
      setFormData((prev) => ({
        ...prev,
        discountedPrice: Math.floor(calculated),
      }));
    }
  }, [formData.price, formData.discountRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('전송할 데이터:', formData);
    alert(productId ? '수정이 완료되었습니다.' : '등록이 완료되었습니다.');
    navigate('/admin/product');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.sideTitle}>
          <h1>마이페이지</h1>
          <h2>- 상품 관리</h2>
          <h2>- {productId ? '상품 수정' : '상품 등록'}</h2>
        </div>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.imageUploadSection}>
            <label className={styles.imageLabel}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
              <div className={styles.imagePlaceholder}>
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="미리보기" />
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
                placeholder="상품명 입력"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>가격 입력</label>
              <div className={styles.withUnit}>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="가격 입력"
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
                  value={formData.discountedPrice}
                  readOnly
                  placeholder="할인된 가격(자동으로 계산돼서 나와야 해요!)"
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
                  placeholder="수량 입력"
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
                placeholder="옵션을 입력하세요"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>사이즈 입력</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="사이즈를 입력하세요"
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              {productId ? '수정 완료' : '등록 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
