import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import MainPage from './pages/Mainpage';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import LoginPage from './pages/Auth/LoginPage/LoginPage';
import SingupPage from './pages/Auth/SingupPage/SingupPage';
import UserSingupPage from './pages/Auth/SingupPage/UserSingupPage';
import AdminSingupPage from './pages/Auth/SingupPage/AdminSingupPage';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element = {<LoginPage />}/>
          <Route path="/sing" element = {<SingupPage/>}/>
          <Route path="/singup/personal" element= {<UserSingupPage/>}/>
          <Route path="/singup/admin" element= {<AdminSingupPage/>}/>

        </Routes>
      </Layout>
    </BrowserRouter>
    </ToastProvider>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
