// quan-ly-chung-cu/src/components/HoKhau/NhanKhau/DeleteNhanKhau.js
import React, { useState } from 'react';
import axios from 'axios';

const DeleteNhanKhau = ({ nhanKhau, onNhanKhauDeleted, onCancel }) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDelete = async () => {
        setError('');
        setSuccess('');

        if (window.confirm(`Bạn có chắc chắn muốn xóa nhân khẩu "${nhanKhau.hoVaTen}" (CMND/CCCD: ${nhanKhau.cmndCcid}) không?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(
                    `http://localhost:5000/api/nhan-khau/${nhanKhau.id}`,
                    {
                        headers: {
                            'x-auth-token': token,
                        },
                    }
                );
                setSuccess('Nhân khẩu đã được xóa thành công!');
                if (onNhanKhauDeleted) {
                    onNhanKhauDeleted(); // Gọi hàm callback để reload danh sách
                }
            } catch (err) {
                console.error('Lỗi khi xóa nhân khẩu:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi xóa nhân khẩu.');
            }
        }
    };

    return (
        <div className="form-container">
            <h3>Xóa Nhân khẩu</h3>
            <p>Bạn sắp xóa nhân khẩu: <strong>{nhanKhau.hoVaTen}</strong> ({nhanKhau.gioiTinh}) sinh ngày <strong>{new Date(nhanKhau.ngaySinh).toLocaleDateString()}</strong>.</p>
            <p>CMND/CCCD: {nhanKhau.cmndCcid || 'Không có'}</p>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="form-actions">
                <button onClick={handleDelete} className="btn btn-danger">Xác nhận xóa</button>
                <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
            </div>
        </div>
    );
};

export default DeleteNhanKhau;