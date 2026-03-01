import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminMyPage.module.css';
import Skeleton from '../../components/common/skeleton/Skeleton';
import Logo from '../../assets/GDGLogo.png';
import useAuthStore from '../../store/useAuthStore';

export default function MyPageAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  //판매내역 데이터 상태관리
  const [ adminOrders, setAdminOrders] = useState([]);
  //현재 로그인 된 관리자의 정보
  const { admin: rawData } = useAuthStore();
  console.log(rawData);
  const adminData = {
    //rawDAta -> mockData의 storeName을 가져오기 위해 사용
    name: rawData?.storeName || "이름 없음",
  };

  useEffect(() => {

    const fetchAdminData = async () => {

      setIsLoading(true);
      try {

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockData = [
          { id: 1, date: '2026.02.01', productName: '버튼 포인트 비니 외 3건', buyer: '김수정' },
          { id: 2, date: '2026.01.14', productName: '하이넥 숏 코트 외 1건', buyer: '조은비' },
          { id: 3, date: '2026.01.14', productName: '하이넥 숏 코트 외 1건', buyer: '최연우' },
          { id: 4, date: '2026.01.14', productName: '하이넥 숏 코트 외 1건', buyer: '김재민' },
          { id: 5, date: '2026.01.14', producctName: '하이넥 숏 코트 외 1건', buyer: '김수정' },
        ];

        setAdminOrders(mockData);
      } catch (error) {
        console.error("데이터 로드 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, [rawData]);

  return (
    <div className={styles.container}>
      <section className={styles.profileCard}>
        <div className={styles.logoCircle}>
          <img src={Logo} alt="GDG Logo" />
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.teamName}>{adminData.name}</h2>
          <button className={styles.adminButton} onClick={() => {
            navigate('/mypage/admin/product_manage');
          }}>상품 관리</button>
        </div>
      </section>

      <section className={styles.orderSection}>
        <h3 className={styles.sectionTitle}>판매내역 조회</h3>
        <div className={styles.orderList}>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.orderItemSkeleton}>
                <Skeleton width="100%" height="80px" borderRadius="8px" />
              </div>
            ))
          ) : (
            adminOrders.map((order) => (
              <div key = {order.id} className = {styles.orderItem}>
                <div className = {styles.orderMain}>
                  <span className = {styles.date}>{order.date}</span>
                  <p classNAme = {styles.prodcutName}>{order.productName}</p>
                </div>
                <span className = {styles.buyer}>주문자 : {order.buyer}</span>
                </div>
            ))
          )}
        </div>

        <button className={styles.moreButton}>더보기</button>
      </section>
    </div>
  );
}