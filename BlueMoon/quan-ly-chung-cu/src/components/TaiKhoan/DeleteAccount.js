// quan-ly-chung-cu/src/components/TaiKhoan/DeleteAccount.js
import React, { useState } from 'react';
import axios from 'axios';

const DeleteAccount = ({ account, onAccountDeleted, onCancel }) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDelete = async () => {
        setError('');
        setSuccess('');

        // Lấy ID của người dùng hiện tại từ localStorage để kiểm tra
        const currentUserId = localStorage.getItem('userId'); // Chúng ta sẽ cần lưu userId vào localStorage khi đăng nhập

        if (account.id === currentUserId) {
            setError('Bạn không thể xóa tài khoản của chính mình!');
            return;
        }

        if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${account.username} không?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(
                    `http://localhost:5000/api/users/${account.id}`,
                    {
                        headers: {
                            'x-auth-token': token,
                        },
                    }
                );
                setSuccess('Tài khoản đã được xóa thành công!');
                if (onAccountDeleted) {
                    onAccountDeleted(); // Gọi hàm callback để reload danh sách
                }
            } catch (err) {
                console.error('Lỗi khi xóa tài khoản:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi xóa tài khoản.');
            }
        }
    };

    return (
        <div className="form-container">
            <h3>Xóa Tài khoản</h3>
            <p>Bạn sắp xóa tài khoản: <strong>{account.username}</strong> ({account.role}).</p>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="form-actions">
                <button onClick={handleDelete} className="btn btn-danger">Xác nhận xóa</button>
                <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
            </div>
        </div>
    );
};

export default DeleteAccount;