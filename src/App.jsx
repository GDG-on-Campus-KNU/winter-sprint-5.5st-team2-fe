import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { ToastProvider } from './context/ToastContext';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage/CheckoutSuccessPage';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import LoginPage from './pages/Auth/LoginPage/LoginPage';
import SingupPage from './pages/Auth/SingupPage/SingupPage';
import UserSingupPage from './pages/Auth/SingupPage/UserSingupPage';
import AdminSingupPage from './pages/Auth/SingupPage/AdminSingupPage';
import AdminMyPage from './pages/MyPage/AdminMyPage';
import ProductManage from './pages/MyPage/ProductManage';
import ProductForm from './pages/MyPage/ProductForm';
import ProductEdit from './pages/MyPage/ProductEdit';
import MyPage from './pages/MyPage/UserMyPage';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/singup" element={<SingupPage />} />
            <Route path="/singup/personal" element={<UserSingupPage />} />
            <Route path="/singup/admin" element={<AdminSingupPage />} />
            <Route path="/mypage/admin" element={<AdminMyPage />} />
            <Route
              path="/mypage/admin/product_manage"
              element={<ProductManage />}
            />
            <Route
              path="/mypage/admin/product_form"
              element={<ProductForm />}
            />
            <Route
              path="/mypage/admin/product_edit/:productId"
              element={<ProductEdit />}
            />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
}
