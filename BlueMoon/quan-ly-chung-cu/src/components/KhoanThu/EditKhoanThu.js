// quan-ly-chung-cu/src/components/KhoanThu/EditKhoanThu.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditKhoanThu = ({ khoanThu, onKhoanThuUpdated, onCancel }) => {
    const [tenKhoanThu, setTenKhoanThu] = useState(khoanThu.tenKhoanThu || '');
    const [moTa, setMoTa] = useState(khoanThu.moTa || '');
    const [mucPhi, setMucPhi] = useState(khoanThu.mucPhi ? parseFloat(khoanThu.mucPhi).toString() : '');
    const [donVi, setDonVi] = useState(khoanThu.donVi || '/hộ');
    const [batBuoc, setBatBuoc] = useState(khoanThu.batBuoc !== undefined ? khoanThu.batBuoc : true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (khoanThu) {
            setTenKhoanThu(khoanThu.tenKhoanThu);
            setMoTa(khoanThu.moTa || '');
            setMucPhi(khoanThu.mucPhi ? parseFloat(khoanThu.mucPhi).toString() : '');
            setDonVi(khoanThu.donVi);
            setBatBuoc(khoanThu.batBuoc);
            setError('');
            setSuccess('');
        }
    }, [khoanThu]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/khoan-thu/${khoanThu.id}`,
                { tenKhoanThu, moTa, mucPhi: parseFloat(mucPhi), donVi, batBuoc },
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );
            setSuccess('Khoản thu đã được cập nhật thành công!');
            if (onKhoanThuUpdated) {
                onKhoanThuUpdated();
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật khoản thu:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi cập nhật khoản thu.');
        }
    };

    return (
        <div className="form-container">
            <h3>Chỉnh sửa Khoản thu: {khoanThu.tenKhoanThu}</h3>
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
                        step="0.01"
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
                    <button type="submit" className="btn btn-primary">Cập nhật</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default EditKhoanThu;