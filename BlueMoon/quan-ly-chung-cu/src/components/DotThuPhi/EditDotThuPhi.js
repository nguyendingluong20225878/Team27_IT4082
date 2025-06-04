// quan-ly-chung-cu/src/components/DotThuPhi/EditDotThuPhi.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditDotThuPhi = ({ dotThuPhi, onDotThuPhiUpdated, onCancel }) => {
    const [tenDotThu, setTenDotThu] = useState(dotThuPhi.tenDotThu || '');
    const [moTa, setMoTa] = useState(dotThuPhi.moTa || '');
    const [ngayBatDau, setNgayBatDau] = useState(dotThuPhi.ngayBatDau ? new Date(dotThuPhi.ngayBatDau).toISOString().split('T')[0] : '');
    const [ngayKetThuc, setNgayKetThuc] = useState(dotThuPhi.ngayKetThuc ? new Date(dotThuPhi.ngayKetThuc).toISOString().split('T')[0] : '');
    const [trangThai, setTrangThai] = useState(dotThuPhi.trangThai || 'Sắp tới');
    const [khoanThusAvailable, setKhoanThusAvailable] = useState([]); // Tất cả các khoản thu có sẵn
    const [selectedKhoanThus, setSelectedKhoanThus] = useState(dotThuPhi.khoanThus ? dotThuPhi.khoanThus.map(kt => kt.id) : []);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loadingKhoanThus, setLoadingKhoanThus] = useState(true);

    useEffect(() => {
        if (dotThuPhi) {
            setTenDotThu(dotThuPhi.tenDotThu);
            setMoTa(dotThuPhi.moTa || '');
            setNgayBatDau(dotThuPhi.ngayBatDau ? new Date(dotThuPhi.ngayBatDau).toISOString().split('T')[0] : '');
            setNgayKetThuc(dotThuPhi.ngayKetThuc ? new Date(dotThuPhi.ngayKetThuc).toISOString().split('T')[0] : '');
            setTrangThai(dotThuPhi.trangThai);
            setSelectedKhoanThus(dotThuPhi.khoanThus ? dotThuPhi.khoanThus.map(kt => kt.id) : []);
            setError('');
            setSuccess('');
        }
    }, [dotThuPhi]);

    useEffect(() => {
        const fetchAllKhoanThus = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/khoan-thu', {
                    headers: { 'x-auth-token': token },
                });
                setKhoanThusAvailable(res.data);
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
            await axios.put(
                `http://localhost:5000/api/dot-thu-phi/${dotThuPhi.id}`,
                { tenDotThu, moTa, ngayBatDau, ngayKetThuc, trangThai, khoanThusIds: selectedKhoanThus },
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );
            setSuccess('Đợt thu phí đã được cập nhật thành công!');
            if (onDotThuPhiUpdated) {
                onDotThuPhiUpdated();
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật đợt thu phí:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi cập nhật đợt thu phí.');
        }
    };

    return (
        <div className="form-container">
            <h3>Chỉnh sửa Đợt thu phí: {dotThuPhi.tenDotThu}</h3>
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
                    <label>Trạng thái:</label>
                    <select value={trangThai} onChange={(e) => setTrangThai(e.target.value)} required>
                        <option value="Sắp tới">Sắp tới</option>
                        <option value="Đang diễn ra">Đang diễn ra</option>
                        <option value="Đã kết thúc">Đã kết thúc</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Chọn các Khoản thu áp dụng:</label>
                    {loadingKhoanThus ? (
                        <p>Đang tải khoản thu...</p>
                    ) : khoanThusAvailable.length === 0 ? (
                        <p>Chưa có khoản thu nào. Vui lòng thêm khoản thu trước.</p>
                    ) : (
                        <div className="checkbox-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            {khoanThusAvailable.map((khoan) => (
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
                    <button type="submit" className="btn btn-primary">Cập nhật</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default EditDotThuPhi;