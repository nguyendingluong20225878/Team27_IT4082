// quan-ly-chung-cu/src/components/HoKhau/NhanKhau/AddNhanKhau.js
import React, { useState } from 'react';
import axios from 'axios';

const AddNhanKhau = ({ hoKhauId, onNhanKhauAdded, onCancel }) => {
    const [hoVaTen, setHoVaTen] = useState('');
    const [gioiTinh, setGioiTinh] = useState('Nam');
    const [ngaySinh, setNgaySinh] = useState(''); // YYYY-MM-DD
    const [cmndCcid, setCmndCcid] = useState('');
    const [quanHeVoiChuHo, setQuanHeVoiChuHo] = useState('');
    const [noiLamViec, setNoiLamViec] = useState('');
    const [ngayChuyenDen, setNgayChuyenDen] = useState(''); // YYYY-MM-DD
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/nhan-khau',
                { hoKhauId, hoVaTen, gioiTinh, ngaySinh, cmndCcid, quanHeVoiChuHo, noiLamViec, ngayChuyenDen },
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );
            setSuccess('Nhân khẩu đã được thêm thành công!');
            // Reset form
            setHoVaTen('');
            setGioiTinh('Nam');
            setNgaySinh('');
            setCmndCcid('');
            setQuanHeVoiChuHo('');
            setNoiLamViec('');
            setNgayChuyenDen('');
            if (onNhanKhauAdded) {
                onNhanKhauAdded(); // Gọi hàm callback để reload danh sách
            }
        } catch (err) {
            console.error('Lỗi khi thêm nhân khẩu:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi thêm nhân khẩu.');
        }
    };

    return (
        <div className="form-container">
            <h3>Thêm Nhân khẩu mới cho Hộ khẩu</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Họ và tên:</label>
                    <input type="text" value={hoVaTen} onChange={(e) => setHoVaTen(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Giới tính:</label>
                    <select value={gioiTinh} onChange={(e) => setGioiTinh(e.target.value)} required>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Ngày sinh:</label>
                    <input type="date" value={ngaySinh} onChange={(e) => setNgaySinh(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>CMND/CCCD:</label>
                    <input type="text" value={cmndCcid} onChange={(e) => setCmndCcid(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Quan hệ với chủ hộ:</label>
                    <input type="text" value={quanHeVoiChuHo} onChange={(e) => setQuanHeVoiChuHo(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Nơi làm việc:</label>
                    <input type="text" value={noiLamViec} onChange={(e) => setNoiLamViec(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Ngày chuyển đến:</label>
                    <input type="date" value={ngayChuyenDen} onChange={(e) => setNgayChuyenDen(e.target.value)} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Thêm Nhân khẩu</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default AddNhanKhau;