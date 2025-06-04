// quan-ly-chung-cu/src/components/KhoanThu/DeleteKhoanThu.js
import React, { useState } from 'react';
import axios from 'axios';

const DeleteKhoanThu = ({ khoanThu, onKhoanThuDeleted, onCancel }) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDelete = async () => {
        setError('');
        setSuccess('');

        if (window.confirm(`Bạn có chắc chắn muốn xóa khoản thu "${khoanThu.tenKhoanThu}" không?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(
                    `http://localhost:5000/api/khoan-thu/${khoanThu.id}`,
                    {
                        headers: {
                            'x-auth-token': token,
                        },
                    }
                );
                setSuccess('Khoản thu đã được xóa thành công!');
                if (onKhoanThuDeleted) {
                    onKhoanThuDeleted();
                }
            } catch (err) {
                console.error('Lỗi khi xóa khoản thu:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi xóa khoản thu.');
            }
        }
    };

    return (
        <div className="form-container">
            <h3>Xóa Khoản thu</h3>
            <p>Bạn sắp xóa khoản thu: <strong>{khoanThu.tenKhoanThu}</strong> (Mức phí: {parseFloat(khoanThu.mucPhi).toLocaleString('vi-VN')} VND {khoanThu.donVi}).</p>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="form-actions">
                <button onClick={handleDelete} className="btn btn-danger">Xác nhận xóa</button>
                <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
            </div>
        </div>
    );
};

export default DeleteKhoanThu;