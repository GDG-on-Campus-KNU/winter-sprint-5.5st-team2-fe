import React from 'react';
import { useLocation } from 'react-router-dom';

function CheckoutPage() {
  const location = useLocation();
  const payload = location.state?.payload;

  return (
    <section
      style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px' }}
    >
      <h1>구매하기</h1>
      <p>주문 API 전송 후 이동한 페이지입니다.</p>
      {payload ? <pre>{JSON.stringify(payload, null, 2)}</pre> : null}
    </section>
  );
}

export default CheckoutPage;
