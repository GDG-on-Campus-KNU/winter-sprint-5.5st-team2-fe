import React from 'react';
import styles from './MyShoppingLinks.module.css';
import { Link } from 'react-router-dom';
import ArrowIcon from '../../assets/right-arrow.png';

export default function MyShoppingLinks() {
  return (
    <div className={styles.card}>
      <Link to="/orders" className={styles.link}>
        <span className={styles.label}>주문내역 확인하기</span>
        <img
          src={ArrowIcon}
          className={styles.arrow}
          alt=""
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
