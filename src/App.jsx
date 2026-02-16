import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './component/Layout/Layout';
import MainPage from './page/Mainpage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
