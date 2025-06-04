// quan-ly-chung-cu/src/pages/DashboardPage.js
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function DashboardPage({ userRole, onLogout }) {
    // Lấy username từ localStorage để hiển thị trên header
    const username = localStorage.getItem('username') || 'Người dùng';

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <h1>Quản lý chung cư BlueMoon</h1>
                <div>
                    <span>Xin chào, {username} ({userRole})</span>
                    <button
                        onClick={onLogout}
                        className="logout-button"
                        // Thêm một số style cơ bản để nút nhìn đẹp hơn, bạn có thể chỉnh sửa trong CSS
                        style={{ marginLeft: '10px', padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Đăng xuất
                    </button>
                </div>
            </header>
            <nav className="dashboard-nav">
                <ul>
                    {/* Menu cho Tổ trưởng/Tổ phó */}
                    {userRole === 'Tổ trưởng/Tổ phó' && (
                        <>
                            {/* SỬA ĐƯỜNG DẪN TẠI ĐÂY: DÙNG ĐƯỜNG DẪN TUYỆT ĐỐI TỪ GỐC DASHBOARD */}
                            <li><Link to="/dashboard/ho-khau">Quản lý Hộ khẩu</Link></li>
                            <li><Link to="/dashboard/tai-khoan">Quản lý Tài khoản</Link></li>
                        </>
                    )}
                    {/* Menu cho Kế toán */}
                    {userRole === 'Kế toán' && (
                        <>
                            {/* SỬA ĐƯỜNG DẪN TẠI ĐÂY: DÙNG ĐƯỜNG DẪN TUYỆT ĐỐI TỪ GỐC DASHBOARD */}
                            <li><Link to="/dashboard/khoan-thu">Quản lý Khoản thu</Link></li>
                            <li><Link to="/dashboard/dot-thu-phi">Quản lý Đợt thu phí</Link></li>
                        </>
                    )}
                </ul>
            </nav>
            <main className="dashboard-content">
                {/* Đây là nơi nội dung của các route con sẽ được render */}
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardPage;