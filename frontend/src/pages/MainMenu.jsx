import React from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

function MainMenu() {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        localStorage.removeItem('name'); // Xóa cả tên người dùng nếu có
        navigate('/'); // Chuyển hướng về trang đăng nhập
    };

    return (
        <div className="account-container main-menu-container">
            <h2 className="account-title">Xin chào, {name || 'người dùng'}</h2>
            <p className="main-menu-role">Vai trò: {role}</p>

            {role === 'admin' && (
                <div className="card-panel main-menu-section">
                    <h4>Chức năng</h4>
                    <div className="main-menu-buttons">
                        <button onClick={() => navigate('/household')} className="submit-btn main-menu-btn">Quản lý hộ khẩu</button>
                        <button onClick={() => navigate('/resident')} className="submit-btn main-menu-btn">Quản lý nhân khẩu</button>
                        <button onClick={() => navigate('/account')} className="submit-btn main-menu-btn">Quản lý tài khoản</button>
                        <button onClick={() => navigate('/vehicle')} className="submit-btn main-menu-btn">Quản lý phương tiện</button>
                    </div>
                </div>
            )}

            {role === 'accountant' && (
                <div className="card-panel main-menu-section">
                    <h4>Chức năng</h4>
                    <div className="main-menu-buttons">
                        <button onClick={() => navigate('/fee')} className="submit-btn main-menu-btn">Quản lý khoản thu</button>
                        <button onClick={() => navigate('/collection-period')} className="submit-btn main-menu-btn">Quản lý đợt thu</button>
                    </div>
                </div>
            )}


        </div>
    );
}

export default MainMenu;