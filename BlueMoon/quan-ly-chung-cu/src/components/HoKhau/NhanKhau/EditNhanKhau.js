// quan-ly-chung-cu/src/components/HoKhau/NhanKhau/EditNhanKhau.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditNhanKhau = ({ nhanKhau, onNhanKhauUpdated, onCancel }) => {
    const [hoVaTen, setHoVaTen] = useState(nhanKhau.hoVaTen || '');
    const [gioiTinh, setGioiTinh] = useState(nhanKhau.gioiTinh || 'Nam');
    const [ngaySinh, setNgaySinh] = useState(nhanKhau.ngaySinh ? new Date(nhanKhau.ngaySinh).toISOString().split('T')[0] : '');
    const [cmndCcid, setCmndCcid] = useState(nhanKhau.cmndCcid || '');
    const [quanHeVoiChuHo, setQuanHeVoiChuHo] = useState(nhanKhau.quanHeVoiChuHo || '');
    const [noiLamViec, setNoiLamViec] = useState(nhanKhau.noiLamViec || '');
    const [ngayChuyenDen, setNgayChuyenDen] = useState(nhanKhau.ngayChuyenDen ? new Date(nhanKhau.ngayChuyenDen).toISOString().split('T')[0] : '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (nhanKhau) {
            setHoVaTen(nhanKhau.hoVaTen);
            setGioiTinh(nhanKhau.gioiTinh);
            setNgaySinh(nhanKhau.ngaySinh ? new Date(nhanKhau.ngaySinh).toISOString().split('T')[0] : '');
            setCmndCcid(nhanKhau.cmndCcid);
            setQuanHeVoiChuHo(nhanKhau.quanHeVoiChuHo);
            setNoiLamViec(nhanKhau.noiLamViec);
            setNgayChuyenDen(nhanKhau.ngayChuyenDen ? new Date(nhanKhau.ngayChuyenDen).toISOString().split('T')[0] : '');
            setError('');
            setSuccess('');
        }
    }, [nhanKhau]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/nhan-khau/${nhanKhau.id}`,
                { hoVaTen, gioiTinh, ngaySinh, cmndCcid, quanHeVoiChuHo, noiLamViec, ngayChuyenDen },
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );
            setSuccess('Nhân khẩu đã được cập nhật thành công!');
            if (onNhanKhauUpdated) {
                onNhanKhauUpdated(); // Gọi hàm callback để reload danh sách
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật nhân khẩu:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi cập nhật nhân khẩu.');
        }
    };

    return (
        <div className="form-container">
            <h3>Chỉnh sửa Nhân khẩu: {nhanKhau.hoVaTen}</h3>
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
                    <button type="submit" className="btn btn-primary">Cập nhật</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default EditNhanKhau;