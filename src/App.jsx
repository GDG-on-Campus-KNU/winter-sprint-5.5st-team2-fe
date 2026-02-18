import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './component/Layout/Layout';
import HomePage from './page/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
