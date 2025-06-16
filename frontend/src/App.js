import React, { useState, useEffect } from 'react'; // Import useState và useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import MainMenu from './pages/MainMenu';
import AccountPage from './pages/AccountPage';
import HouseholdPage from './pages/HouseholdPage';
import ResidentPage from './pages/ResidentPage';
import FeePage from './pages/FeePage';
import CollectionPeriodPage from './pages/CollectionPeriodPage';
import FeedbackPage from './pages/FeedbackPage';
import VehiclePage from './pages/VehiclePage';

import Header from './components/Header';

function App() {
  // 1. Tạo state để quản lý trạng thái đăng nhập
  const [loggedIn, setLoggedIn] = useState(false);

  // Hàm kiểm tra trạng thái đăng nhập từ localStorage
  const checkAuthStatus = () => {
    return localStorage.getItem('accessToken') ? true : false;
  };

  // 2. Sử dụng useEffect để kiểm tra trạng thái đăng nhập khi component mount (lần đầu tải)
  // và cập nhật state 'loggedIn'
  useEffect(() => {
    setLoggedIn(checkAuthStatus());
  }, []); // Empty dependency array means this runs once on mount

  // Hàm này sẽ được truyền xuống AuthPage
  const handleLoginSuccess = () => {
    setLoggedIn(true); // Cập nhật state khi đăng nhập thành công
  };

  // Hàm này có thể dùng cho logout (tùy chọn, nếu bạn muốn xử lý logout ở App.js)
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setLoggedIn(false); // Cập nhật state khi đăng xuất
  };

  // Protected Route component - giờ sử dụng state 'loggedIn'
  const ProtectedRoute = ({ children }) => {
    if (!loggedIn) { // Kiểm tra state 'loggedIn'
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      {/* Header hiển thị dựa trên state 'loggedIn' */}
      {loggedIn && <Header onLogout={handleLogout} />}{" "}
      {/* Truyền handleLogout xuống Header nếu bạn muốn nút logout ở Header kích hoạt việc cập nhật state */}

      <Routes>
        {/* Route cho trang đăng nhập/đăng ký */}
        <Route
          path="/"
          element={
            loggedIn ? ( // Kiểm tra state 'loggedIn'
              <Navigate to="/menu" replace />
            ) : (
              <AuthPage onLoginSuccess={handleLoginSuccess} /> // Truyền hàm callback xuống AuthPage
            )
          }
        />

        {/* Các Route cần bảo vệ - sử dụng ProtectedRoute */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <MainMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/household"
          element={
            <ProtectedRoute>
              <HouseholdPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident"
          element={
            <ProtectedRoute>
              <ResidentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fee"
          element={
            <ProtectedRoute>
              <FeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collection-period"
          element={
            <ProtectedRoute>
              <CollectionPeriodPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicle"
          element={
            <ProtectedRoute>
              <VehiclePage />
            </ProtectedRoute>
          }
        />

        {/* Fallback route cho các đường dẫn không khớp */}
        <Route
          path="*"
          element={
            loggedIn ? ( // Kiểm tra state 'loggedIn'
              <Navigate to="/menu" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;