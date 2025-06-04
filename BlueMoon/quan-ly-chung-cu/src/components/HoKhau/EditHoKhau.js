// quan-ly-chung-cu/src/components/HoKhau/EditHoKhau.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditHoKhau = ({ hoKhau, onHoKhauUpdated, onCancel }) => {
    const [maHoKhau, setMaHoKhau] = useState(hoKhau.maHoKhau || '');
    const [diaChi, setDiaChi] = useState(hoKhau.diaChi || '');
    const [chuHo, setChuHo] = useState(hoKhau.chuHo || '');
    // Format ngày để hiển thị đúng trong input type="date"
    const [ngayLap, setNgayLap] = useState(hoKhau.ngayLap ? new Date(hoKhau.ngayLap).toISOString().split('T')[0] : '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (hoKhau) {
            setMaHoKhau(hoKhau.maHoKhau);
            setDiaChi(hoKhau.diaChi);
            setChuHo(hoKhau.chuHo);
            setNgayLap(hoKhau.ngayLap ? new Date(hoKhau.ngayLap).toISOString().split('T')[0] : '');
            setError('');
            setSuccess('');
        }
    }, [hoKhau]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/ho-khau/${hoKhau.id}`,
                { maHoKhau, diaChi, chuHo, ngayLap },
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );
            setSuccess('Hộ khẩu đã được cập nhật thành công!');
            if (onHoKhauUpdated) {
                onHoKhauUpdated(); // Gọi hàm callback để reload danh sách
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật hộ khẩu:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi cập nhật hộ khẩu.');
        }
    };

    return (
        <div className="form-container">
            <h3>Chỉnh sửa Hộ khẩu: {hoKhau.maHoKhau}</h3>
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
                    <button type="submit" className="btn btn-primary">Cập nhật</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default EditHoKhau;