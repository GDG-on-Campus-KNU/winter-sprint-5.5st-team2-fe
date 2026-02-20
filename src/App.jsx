import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import MainPage from './pages/Mainpage';
import ProductDetail from './pages/ProductDetail/ProductDetail';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
