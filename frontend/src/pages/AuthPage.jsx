import React, { useState } from 'react';
import axios from 'axios';
import './pages.css';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ email: '', password: '', fullname: '', phoneNumber: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const res = await axios.post('/api/auth/login', {
                    email: form.email,
                    password: form.password
                });
                alert('Đăng nhập thành công!');
                setMessage(res.data.message);
            } else {
                const res = await axios.post('/api/auth/register', {
                    email: form.email,
                    password: form.password,
                    fullname: form.fullname,
                    phoneNumber: form.phoneNumber
                });
                alert('Đăng ký thành công!');
                setMessage(res.data.message);
                setIsLogin(true);
            }
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Đã xảy ra lỗi');
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} required />
                {!isLogin && (
                    <>
                        <input name="fullname" placeholder="Họ tên" value={form.fullname} onChange={handleChange} required />
                        <input name="phoneNumber" placeholder="Số điện thoại" value={form.phoneNumber} onChange={handleChange} />
                    </>
                )}
                <button type="submit" className="submit-btn">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</button>
            </form>
            <p className="auth-message">{message}</p>
            <button onClick={() => setIsLogin(!isLogin)} className="auth-toggle-btn">
                {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
            </button>
        </div>
    );
}

export default AuthPage;
