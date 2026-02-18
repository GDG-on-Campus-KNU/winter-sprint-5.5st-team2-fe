import React from 'react';
import styles from './HeroBanner.module.css';

export default function HeroBanner({ imageSrc, title, subtitle, onClick }) {
  return (
    <section className={styles.promoSection} onClick={onClick}>
      <img className={styles.image} src={imageSrc} alt={title} />

      <div className={styles.overlay}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </section>
  );
}
