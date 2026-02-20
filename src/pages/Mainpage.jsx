import React from 'react';
import { Link } from 'react-router-dom';

const Mainpage = () => {
  return (
    <div>
      <p>스프린트</p>
      <Link to="/product/1">상품 상세 보기</Link>
    </div>
  );
};

export default Mainpage;
