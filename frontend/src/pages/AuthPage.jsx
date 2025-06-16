// src/pages/AuthPage.js

import React, { useState } from 'react';
import axios from 'axios';
import './pages.css';
import { useNavigate } from 'react-router-dom';

// AuthPage nhận prop onLoginSuccess
function AuthPage({ onLoginSuccess }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/v1/auth/login', form);
            const { accessToken, user } = res.data.data;

            // Lưu token và thông tin vào localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('role', user.role);
            localStorage.setItem('name', user.name);

            alert('Đăng nhập thành công!');

            // Gọi hàm callback từ App.js để cập nhật state 'loggedIn'
            if (onLoginSuccess) {
                onLoginSuccess();
            }

            // Chuyển hướng và thay thế lịch sử để không thể quay lại trang login
            navigate('/menu', { replace: true });

        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    return (
        // THAY ĐỔI TẠI ĐÂY: Thêm div bọc ngoài để căn giữa trang đăng nhập
        <div className="auth-page-wrapper">
            <div className="auth-container">
                {/* Thêm dòng này để hiển thị chữ "Phần mềm quản lý chung cư BlueMoon" */}
                <h1 className="app-main-title">Phần mềm quản lý chung cư BlueMoon</h1>
                <h2 className="auth-title">Đăng nhập</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} required />
                    <button type="submit" className="submit-btn">Đăng nhập</button>
                </form>
                <p className="auth-message">{message}</p>
            </div>
        </div>
    );
}

export default AuthPage;