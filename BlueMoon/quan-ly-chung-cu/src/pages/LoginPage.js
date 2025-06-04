// quan-ly-chung-cu/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Đảm bảo đã cài axios: npm install axios
import './LoginPage.css'; // Đảm bảo file CSS này tồn tại hoặc xóa dòng này nếu không có

function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset lỗi

        try {
            // Gửi yêu cầu POST đến API đăng nhập của backend
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password,
            });

            // Lưu token, vai trò và username vào Local Storage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userRole', res.data.role);
            localStorage.setItem('username', res.data.username);

            // Cập nhật trạng thái đăng nhập trong App.js và chuyển hướng
            onLoginSuccess(res.data.role);
            navigate('/dashboard');
        } catch (err) {
            console.error('Lỗi đăng nhập:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Đăng nhập thất bại. Vui lòng thử lại.'); // Hiển thị lỗi từ server
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng nhập Hệ thống</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Đăng nhập</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;