import React from 'react';
import style from './SkeletonCard.module.css';
import Skeleton from './Skeleton.jsx';

const SkeletonCard = () => {
  return (
    <div className={style.cardContainer}>
      <div className={style.imageWrapper}>
        <Skeleton width="100%" height="100%" borderRadius="12px" />
      </div>
      <div className={style.textInfoGroup}>
        <Skeleton width="40%" height="17px" />
        <Skeleton width="100%" height="22px" />
        <Skeleton width="60%" height="19px" />
      </div>
    </div>
  );
};

export default SkeletonCard;
