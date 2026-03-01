import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore';
import NavButton from '../NavButton';
import IconButton from '../IconButton';
import UserIcon from '../../../assets/User.png';
import ShoppingBagIcon from '../../../assets/ShoppingBag.png';
import Logout from '../../../assets/logout.png';
import Navstyle from '../NavButton.module.css';
import Iconstyle from '../IconButton.module.css';
import style from './Header.module.css';
import { useToast } from '../../../context/ToastContext';

function Header() {
  const { isLoggedIn, logout, admin } = useAuthStore();
  const navigate = useNavigate();
  const showToast = useToast();

  const handleLogout = () => {
    logout(); //스토어 상태 초기화하기 + LocalStorage데이터 삭제하기
    navigate('/'); //메인페이지로 복귀시키기
  };

  const handleAdminAccess = (e, path) => {
    if (admin && path === '/') {
      e.preventDefault();
      showToast('관리자는 메인페이지로 이동할 수 없습니다.', 'error');
      return;
    }
  };

  const categories = [
    { label: '아우터', path: '/', key: '/key' },
    { label: '상의', path: '/', key: '/top' },
    { label: '하의', path: '/', key: '/bottom' },
    { label: '가방', path: '/', key: '/bag' },
    { label: '신발', path: '/', key: '/shoes' },
    { label: '악세사리', path: '/', key: '/accessories' },
  ];

  const myPagePath = admin ? '/mypage/admin' : '/mypage';

  const iconButton = [
    { label: '마이페이지', path: myPagePath, key: '/my', icon: UserIcon },
    {
      label: '장바구니',
      path: '/cart',
      key: '/cart',
      icon: ShoppingBagIcon,
    },
  ];

  console.log(admin);
  return (
    <header className={style.header}>
      <NavButton
        key="/main"
        label="서비스 이름"
        path="/"
        className={Navstyle.NavButton}
        onClick={(e) => handleAdminAccess(e, '/')}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <nav>
            {categories.map((item) => (
              <NavButton
                key={item.key}
                label={item.label}
                path={item.path}
                className={Navstyle.NavButton}
                onClick={(e) => handleAdminAccess(e, item.path)}
              />
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', padding: '10px 10px' }}>
          <nav style={{ display: 'flex' }}>
            {iconButton.map((item) => (
              <IconButton
                key={item.key}
                label={item.label}
                path={item.path}
                Icon={item.icon}
                className={Iconstyle.IconButton}
                onClick={(e) => {
                  if (admin && item.path === '/cart') {
                    e.preventDefault();
                    showToast(
                      '관리자는 장바구니를 이용할 수 없습니다.',
                      'error',
                    );
                  }
                }}
              />
            ))}
          </nav>
          {isLoggedIn ? (
            <IconButton
              key="/logout"
              label="로그아웃"
              path="/"
              Icon={Logout}
              className={Iconstyle.logoutIconButton}
              onClick={handleLogout}
            />
          ) : (
            <NavButton
              key="/login"
              label="로그인/회원가입"
              path="/login"
              className={Navstyle.NavButtonlogin}
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
