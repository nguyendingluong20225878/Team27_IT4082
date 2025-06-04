// quan-ly-chung-cu/src/components/KhoanThu/AddKhoanThu.js
import React, { useState } from 'react';
import axios from 'axios';

const AddKhoanThu = ({ onKhoanThuAdded, onCancel }) => {
    const [tenKhoanThu, setTenKhoanThu] = useState('');
    const [moTa, setMoTa] = useState('');
    const [mucPhi, setMucPhi] = useState('');
    const [donVi, setDonVi] = useState('/hộ'); // Mặc định đơn vị
    const [batBuoc, setBatBuoc] = useState(true); // Mặc định là bắt buộc
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/khoan-thu',
                { tenKhoanThu, moTa, mucPhi: parseFloat(mucPhi), donVi, batBuoc },
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );
            setSuccess('Khoản thu đã được thêm thành công!');
            // Reset form
            setTenKhoanThu('');
            setMoTa('');
            setMucPhi('');
            setDonVi('/hộ');
            setBatBuoc(true);
            if (onKhoanThuAdded) {
                onKhoanThuAdded();
            }
        } catch (err) {
            console.error('Lỗi khi thêm khoản thu:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi thêm khoản thu.');
        }
    };

    return (
        <div className="form-container">
            <h3>Thêm Khoản thu mới</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên khoản thu:</label>
                    <input
                        type="text"
                        value={tenKhoanThu}
                        onChange={(e) => setTenKhoanThu(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mô tả:</label>
                    <textarea
                        value={moTa}
                        onChange={(e) => setMoTa(e.target.value)}
                        rows="3"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Mức phí:</label>
                    <input
                        type="number"
                        step="0.01" // Cho phép số thập phân
                        value={mucPhi}
                        onChange={(e) => setMucPhi(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Đơn vị:</label>
                    <select value={donVi} onChange={(e) => setDonVi(e.target.value)} required>
                        <option value="/hộ">/hộ</option>
                        <option value="/người">/người</option>
                        <option value="/m2">/m2</option>
                        <option value="/tháng">/tháng</option>
                        <option value="khác">khác</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={batBuoc}
                            onChange={(e) => setBatBuoc(e.target.checked)}
                        />
                        Là khoản thu bắt buộc
                    </label>
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Thêm Khoản thu</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default AddKhoanThu;