import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import styles from './Layout.module.css';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {

  const location = useLocation();

  const hideFooterPaths = ['/login', '/sing', '/singup/personal', 'singup/admin'];

  const shouldHideFooter = hideFooterPaths.includes(location.pathname);


const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main className={styles.main}>{children}</main>
      {!shouldHideFooter && <Footer />}
      <Footer />
    </div>
  );
};

export default Layout;
