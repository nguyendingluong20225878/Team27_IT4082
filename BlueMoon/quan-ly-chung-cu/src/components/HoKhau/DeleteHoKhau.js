// quan-ly-chung-cu/src/components/HoKhau/DeleteHoKhau.js
import React, { useState } from 'react';
import axios from 'axios';

const DeleteHoKhau = ({ hoKhau, onHoKhauDeleted, onCancel }) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDelete = async () => {
        setError('');
        setSuccess('');

        if (window.confirm(`Bạn có chắc chắn muốn xóa hộ khẩu "${hoKhau.maHoKhau}" của chủ hộ "${hoKhau.chuHo}" không? Thao tác này sẽ xóa tất cả nhân khẩu liên quan!`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(
                    `http://localhost:5000/api/ho-khau/${hoKhau.id}`,
                    {
                        headers: {
                            'x-auth-token': token,
                        },
                    }
                );
                setSuccess('Hộ khẩu đã được xóa thành công!');
                if (onHoKhauDeleted) {
                    onHoKhauDeleted(); // Gọi hàm callback để reload danh sách
                }
            } catch (err) {
                console.error('Lỗi khi xóa hộ khẩu:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi xóa hộ khẩu.');
            }
        }
    };

    return (
        <div className="form-container">
            <h3>Xóa Hộ khẩu</h3>
            <p>Bạn sắp xóa hộ khẩu: <strong>{hoKhau.maHoKhau}</strong> của chủ hộ <strong>{hoKhau.chuHo}</strong> tại địa chỉ <strong>{hoKhau.diaChi}</strong>.</p>
            <p style={{ color: 'red', fontWeight: 'bold' }}>Lưu ý: Thao tác này sẽ xóa vĩnh viễn tất cả nhân khẩu thuộc hộ khẩu này.</p>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="form-actions">
                <button onClick={handleDelete} className="btn btn-danger">Xác nhận xóa</button>
                <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
            </div>
        </div>
    );
};

export default DeleteHoKhau;