// quan-ly-chung-cu/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// IMPORT CÁC TRANG (PAGES)
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// IMPORT CÁC COMPONENT QUẢN LÝ CHÍNH TỪ THƯ MỤC 'components/' (CHÍNH XÁC THEO CẤU TRÚC BẠN CUNG CẤP)
import DotThuPhiManagement from './components/DotThuPhiManagement';
import HoKhauManagement from './components/HoKhauManagement';
import KhoanThuManagement from './components/KhoanThuManagement';
import TaiKhoanHeThongManagement from './components/TaiKhoanHeThongManagement';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
      setUserRole(localStorage.getItem('userRole'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <Router>
      <Routes>
        {/* Route cho trang đăng nhập */}
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

        {/* Route mặc định '/' sẽ chuyển hướng đến /dashboard nếu đã đăng nhập, hoặc /login nếu chưa đăng nhập */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* Dashboard và các Route con của Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <DashboardPage userRole={userRole} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* Các Route con của DashboardPage */}
          <Route path="ho-khau" element={<HoKhauManagement />} />
          <Route path="tai-khoan" element={<TaiKhoanHeThongManagement />} />
          <Route path="khoan-thu" element={<KhoanThuManagement />} />
          <Route path="dot-thu-phi" element={<DotThuPhiManagement />} />

          {/* Route mặc định khi chỉ truy cập /dashboard */}
          <Route index element={<p>Chào mừng đến với Dashboard! Vui lòng chọn một chức năng từ menu.</p>} />
        </Route>

        {/* Fallback route cho các đường dẫn không tồn tại */}
        <Route path="*" element={<div>404 - Trang không tìm thấy</div>} />
      </Routes>
    </Router>
  );
}

export default App;