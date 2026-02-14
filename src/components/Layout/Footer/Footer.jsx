import React from 'react';
import style from './Footer.module.css';
import instgram from '../../../assets/instagram.png';
import github from '../../../assets/github.png';

const Footer = () => {
  return (
    <div className={style.background}>
      <div className={style.information}>
        <p>상호명 ALL RIGHTS RESERVED</p>
        <div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <p>상호명 : 미정</p>
            <p>소재지 : 대구광역시 북구 대학로 80</p>
          </div>
          <p>대표자 : GDG Winter Sprint 2</p>
        </div>

        <div
          style={{ display: 'flex', gap: '10px', textDecoration: 'underline' }}
        >
          <p>개인정보 처리방침 </p>
          <p>이용약관</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className={style.button}>
          <img src={instgram} />
        </button>
        <button className={style.button}>
          <img src={github} />
        </button>
      </div>
    </div>
  );
};

export default Footer;
