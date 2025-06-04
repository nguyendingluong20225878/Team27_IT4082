// quan-ly-chung-cu/src/components/TaiKhoan/EditAccount.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditAccount = ({ account, onAccountUpdated, onCancel }) => {
    const [username, setUsername] = useState(account.username || '');
    const [password, setPassword] = useState(''); // Mật khẩu sẽ không hiển thị, chỉ nhập khi muốn thay đổi
    const [role, setRole] = useState(account.role || 'Tổ trưởng/Tổ phó');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setUsername(account.username);
        setRole(account.role);
        setPassword(''); // Reset mật khẩu khi chọn tài khoản khác để sửa
        setError('');
        setSuccess('');
    }, [account]); // Chạy lại khi account prop thay đổi

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const updateData = { username, role };
            if (password) { // Chỉ thêm password vào data nếu người dùng nhập
                updateData.password = password;
            }

            await axios.put(
                `http://localhost:5000/api/users/${account.id}`,
                updateData,
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );
            setSuccess('Tài khoản đã được cập nhật thành công!');
            if (onAccountUpdated) {
                onAccountUpdated(); // Gọi hàm callback để reload danh sách
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật tài khoản:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi cập nhật tài khoản.');
        }
    };

    return (
        <div className="form-container">
            <h3>Chỉnh sửa Tài khoản</h3>
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
                    <label>Mật khẩu (Để trống nếu không thay đổi):</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
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
                    <button type="submit" className="btn btn-primary">Cập nhật</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default EditAccount;