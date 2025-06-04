// quan-ly-chung-cu/src/components/TaiKhoan/CreateAccount.js
import React, { useState } from 'react';
import axios from 'axios';

const CreateAccount = ({ onAccountCreated, onCancel }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Tổ trưởng/Tổ phó'); // Giá trị mặc định
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/users',
                { username, password, role },
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );
            setSuccess('Tài khoản đã được tạo thành công!');
            setUsername('');
            setPassword('');
            setRole('Tổ trưởng/Tổ phó');
            if (onAccountCreated) {
                onAccountCreated(); // Gọi hàm callback để reload danh sách
            }
        } catch (err) {
            console.error('Lỗi khi tạo tài khoản:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi tạo tài khoản.');
        }
    };

    return (
        <div className="form-container">
            <h3>Tạo Tài khoản mới</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên đăng nhập:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Vai trò:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Tổ trưởng/Tổ phó">Tổ trưởng/Tổ phó</option>
                        <option value="Kế toán">Kế toán</option>
                    </select>
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Tạo tài khoản</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default CreateAccount;