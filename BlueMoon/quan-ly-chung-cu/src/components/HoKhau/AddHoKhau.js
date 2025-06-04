// quan-ly-chung-cu/src/components/HoKhau/AddHoKhau.js
import React, { useState } from 'react';
import axios from 'axios';

const AddHoKhau = ({ onHoKhauAdded, onCancel }) => {
    const [maHoKhau, setMaHoKhau] = useState('');
    const [diaChi, setDiaChi] = useState('');
    const [chuHo, setChuHo] = useState('');
    const [ngayLap, setNgayLap] = useState(''); // Định dạng YYYY-MM-DD
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/ho-khau',
                { maHoKhau, diaChi, chuHo, ngayLap },
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );
            setSuccess('Hộ khẩu đã được thêm thành công!');
            setMaHoKhau('');
            setDiaChi('');
            setChuHo('');
            setNgayLap('');
            if (onHoKhauAdded) {
                onHoKhauAdded(); // Gọi hàm callback để reload danh sách
            }
        } catch (err) {
            console.error('Lỗi khi thêm hộ khẩu:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi thêm hộ khẩu.');
        }
    };

    return (
        <div className="form-container">
            <h3>Thêm Hộ khẩu mới</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Mã Hộ khẩu:</label>
                    <input
                        type="text"
                        value={maHoKhau}
                        onChange={(e) => setMaHoKhau(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Địa chỉ:</label>
                    <input
                        type="text"
                        value={diaChi}
                        onChange={(e) => setDiaChi(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Chủ hộ:</label>
                    <input
                        type="text"
                        value={chuHo}
                        onChange={(e) => setChuHo(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Ngày lập:</label>
                    <input
                        type="date"
                        value={ngayLap}
                        onChange={(e) => setNgayLap(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Thêm Hộ khẩu</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default AddHoKhau;