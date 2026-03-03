import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CheckoutSuccessPage.module.css';

function CheckoutSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <section className={styles.page}>
      <div className={styles.overlay} aria-live="polite">
        <div className={styles.card}>
          <div className={styles.icon} aria-hidden="true">
            <svg viewBox="0 0 48 48" className={styles.check}>
              <circle cx="24" cy="24" r="20" />
              <path d="M15 24.5L21.5 31L33 18" />
            </svg>
          </div>
          <p className={styles.message}>결제가 완료되었습니다!</p>
        </div>
      </div>
    </section>
  );
}

export default CheckoutSuccessPage;
