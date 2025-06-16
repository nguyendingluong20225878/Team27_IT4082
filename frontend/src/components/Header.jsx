import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ onLogout }) {
    const navigate = useNavigate();
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        // Gọi hàm callback từ App.js để xử lý xóa localStorage và cập nhật state 'loggedIn'
        if (onLogout) {
            onLogout();
        }
        // Đặt navigate về '/' (AuthPage) ngay sau khi gọi onLogout.
        // ProtectedRoute trong App.js sẽ xử lý việc chuyển hướng này.
        navigate('/', { replace: true });
    };

    return (
        <header className="app-header">
            <div className="app-header-left">
                <span className="app-title" onClick={() => navigate('/menu')}>BlueMoon</span>
            </div>
            <div className="app-header-right">
                <span className="user-info">Xin chào, {name || 'người dùng'} ({role})</span>
                <button onClick={handleLogout} className="logout-btn header-logout-btn">Đăng xuất</button>
            </div>
        </header>
    );
}

export default Header;