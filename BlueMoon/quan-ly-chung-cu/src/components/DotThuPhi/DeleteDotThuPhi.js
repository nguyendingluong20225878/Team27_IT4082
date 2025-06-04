// quan-ly-chung-cu/src/components/DotThuPhi/DeleteDotThuPhi.js
import React, { useState } from 'react';
import axios from 'axios';

const DeleteDotThuPhi = ({ dotThuPhi, onDotThuPhiDeleted, onCancel }) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleDelete = async () => {
        setError('');
        setSuccess('');

        if (window.confirm(`Bạn có chắc chắn muốn xóa đợt thu phí "${dotThuPhi.tenDotThu}" không? Thao tác này sẽ xóa tất cả chi tiết thu phí của đợt này.`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(
                    `http://localhost:5000/api/dot-thu-phi/${dotThuPhi.id}`,
                    {
                        headers: {
                            'x-auth-token': token,
                        },
                    }
                );
                setSuccess('Đợt thu phí đã được xóa thành công!');
                if (onDotThuPhiDeleted) {
                    onDotThuPhiDeleted();
                }
            } catch (err) {
                console.error('Lỗi khi xóa đợt thu phí:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi xóa đợt thu phí.');
            }
        }
    };

    return (
        <div className="form-container">
            <h3>Xóa Đợt thu phí</h3>
            <p>Bạn sắp xóa đợt thu phí: <strong>{dotThuPhi.tenDotThu}</strong> từ ngày <strong>{new Date(dotThuPhi.ngayBatDau).toLocaleDateString()}</strong> đến <strong>{new Date(dotThuPhi.ngayKetThuc).toLocaleDateString()}</strong>.</p>
            <p style={{ color: 'red', fontWeight: 'bold' }}>Lưu ý: Thao tác này sẽ xóa vĩnh viễn tất cả các chi tiết thu phí liên quan đến đợt này.</p>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="form-actions">
                <button onClick={handleDelete} className="btn btn-danger">Xác nhận xóa</button>
                <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
            </div>
        </div>
    );
};

export default DeleteDotThuPhi;