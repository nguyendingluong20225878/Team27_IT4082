// quan-ly-chung-cu/src/components/DotThuPhi/AddDotThuPhi.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddDotThuPhi = ({ onDotThuPhiAdded, onCancel }) => {
    const [tenDotThu, setTenDotThu] = useState('');
    const [moTa, setMoTa] = useState('');
    const [ngayBatDau, setNgayBatDau] = useState('');
    const [ngayKetThuc, setNgayKetThuc] = useState('');
    const [khoanThus, setKhoanThus] = useState([]); // Tất cả các khoản thu có sẵn
    const [selectedKhoanThus, setSelectedKhoanThus] = useState([]); // Các khoản thu được chọn cho đợt này
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loadingKhoanThus, setLoadingKhoanThus] = useState(true);

    useEffect(() => {
        const fetchAllKhoanThus = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/khoan-thu', {
                    headers: { 'x-auth-token': token },
                });
                setKhoanThus(res.data);
            } catch (err) {
                console.error('Lỗi khi tải khoản thu:', err);
                setError('Không thể tải danh sách khoản thu.');
            } finally {
                setLoadingKhoanThus(false);
            }
        };
        fetchAllKhoanThus();
    }, []);

    const handleKhoanThuChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedKhoanThus([...selectedKhoanThus, value]);
        } else {
            setSelectedKhoanThus(selectedKhoanThus.filter((id) => id !== value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (new Date(ngayBatDau) > new Date(ngayKetThuc)) {
            setError('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/dot-thu-phi',
                { tenDotThu, moTa, ngayBatDau, ngayKetThuc, khoanThusIds: selectedKhoanThus },
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );
            setSuccess('Đợt thu phí đã được tạo thành công!');
            // Reset form
            setTenDotThu('');
            setMoTa('');
            setNgayBatDau('');
            setNgayKetThuc('');
            setSelectedKhoanThus([]);
            if (onDotThuPhiAdded) {
                onDotThuPhiAdded();
            }
        } catch (err) {
            console.error('Lỗi khi tạo đợt thu phí:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi tạo đợt thu phí.');
        }
    };

    return (
        <div className="form-container">
            <h3>Tạo Đợt thu phí mới</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên đợt thu:</label>
                    <input
                        type="text"
                        value={tenDotThu}
                        onChange={(e) => setTenDotThu(e.target.value)}
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
                    <label>Ngày bắt đầu:</label>
                    <input
                        type="date"
                        value={ngayBatDau}
                        onChange={(e) => setNgayBatDau(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Ngày kết thúc:</label>
                    <input
                        type="date"
                        value={ngayKetThuc}
                        onChange={(e) => setNgayKetThuc(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Chọn các Khoản thu áp dụng:</label>
                    {loadingKhoanThus ? (
                        <p>Đang tải khoản thu...</p>
                    ) : khoanThus.length === 0 ? (
                        <p>Chưa có khoản thu nào. Vui lòng thêm khoản thu trước.</p>
                    ) : (
                        <div className="checkbox-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            {khoanThus.map((khoan) => (
                                <label key={khoan.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        value={khoan.id}
                                        checked={selectedKhoanThus.includes(khoan.id)}
                                        onChange={handleKhoanThuChange}
                                        style={{ marginRight: '5px' }}
                                    />
                                    {khoan.tenKhoanThu} ({parseFloat(khoan.mucPhi).toLocaleString('vi-VN')} VND {khoan.donVi})
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Tạo Đợt thu phí</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default AddDotThuPhi;