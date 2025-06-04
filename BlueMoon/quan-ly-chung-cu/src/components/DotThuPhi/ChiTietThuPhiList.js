// quan-ly-chung-cu/src/components/DotThuPhi/ChiTietThuPhiList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChiTietThuPhiList = ({ dotThuPhi, onBackToList }) => {
    const [chiTietList, setChiTietList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingChiTietId, setEditingChiTietId] = useState(null);
    const [editSoTienDaDong, setEditSoTienDaDong] = useState('');
    const [editTrangThaiDong, setEditTrangThaiDong] = useState('');
    const [editNgayDong, setEditNgayDong] = useState('');
    const [editGhiChu, setEditGhiChu] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // State cho tìm kiếm

    const fetchChiTietThuPhi = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/dot-thu-phi/${dotThuPhi.id}/chi-tiet-thu-phi`, {
                headers: {
                    'x-auth-token': token,
                },
            });
            setChiTietList(res.data);
        } catch (err) {
            console.error('Lỗi khi tải chi tiết thu phí:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Không thể tải chi tiết thu phí.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dotThuPhi && dotThuPhi.id) {
            fetchChiTietThuPhi();
        }
    }, [dotThuPhi]);

    const handleEditClick = (chiTiet) => {
        setEditingChiTietId(chiTiet.id);
        setEditSoTienDaDong(parseFloat(chiTiet.soTienDaDong).toString());
        setEditTrangThaiDong(chiTiet.trangThaiDong);
        setEditNgayDong(chiTiet.ngayDong ? new Date(chiTiet.ngayDong).toISOString().split('T')[0] : '');
        setEditGhiChu(chiTiet.ghiChu || '');
    };

    const handleUpdateChiTiet = async (chiTietId) => {
        setError('');
        try {
            const token = localStorage.getItem('token');
            const updatedData = {
                soTienDaDong: parseFloat(editSoTienDaDong),
                trangThaiDong: editTrangThaiDong,
                ngayDong: editNgayDong || null,
                ghiChu: editGhiChu,
            };

            await axios.put(
                `http://localhost:5000/api/dot-thu-phi/chi-tiet/${chiTietId}`,
                updatedData,
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );
            alert('Cập nhật chi tiết thu phí thành công!');
            setEditingChiTietId(null); // Thoát chế độ chỉnh sửa
            fetchChiTietThuPhi(); // Tải lại danh sách
        } catch (err) {
            console.error('Lỗi khi cập nhật chi tiết thu phí:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Đã xảy ra lỗi khi cập nhật chi tiết thu phí.');
        }
    };

    // Lọc danh sách chi tiết thu phí dựa trên searchTerm
    const filteredChiTietList = chiTietList.filter(chiTiet =>
        chiTiet.hoKhau.maHoKhau.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chiTiet.hoKhau.chuHo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chiTiet.khoanThu.tenKhoanThu.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="list-container">
            <h3>Chi tiết thu phí Đợt: {dotThuPhi.tenDotThu}</h3>
            <p>Mô tả: {dotThuPhi.moTa}</p>
            <p>Ngày: {new Date(dotThuPhi.ngayBatDau).toLocaleDateString()} - {new Date(dotThuPhi.ngayKetThuc).toLocaleDateString()}</p>
            <p>Trạng thái đợt: <span className={`status-badge status-${dotThuPhi.trangThai.replace(/\s/g, '-').toLowerCase()}`}>{dotThuPhi.trangThai}</span></p>
            <p>Tổng tiền dự kiến thu: <strong>{parseFloat(dotThuPhi.tongTienDuKien).toLocaleString('vi-VN')} VND</strong></p>

            <button onClick={onBackToList} className="btn btn-secondary" style={{ marginBottom: '20px' }}>Quay lại danh sách Đợt thu phí</button>

            {/* Thanh tìm kiếm */}
            <div className="search-bar" style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã hộ khẩu, chủ hộ, khoản thu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
            </div>

            {error && <p className="error-message">{error}</p>}
            {loading ? (
                <p>Đang tải chi tiết thu phí...</p>
            ) : filteredChiTietList.length === 0 ? (
                <p>Chưa có chi tiết thu phí nào cho đợt này. Vui lòng nhấn "Lập DS Thu" để tạo.</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Mã Hộ khẩu</th>
                            <th>Chủ hộ</th>
                            <th>Khoản thu</th>
                            <th>Phải đóng</th>
                            <th>Đã đóng</th>
                            <th>Trạng thái</th>
                            <th>Ngày đóng</th>
                            <th>Ghi chú</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChiTietList.map((chiTiet) => (
                            <tr key={chiTiet.id}>
                                <td>{chiTiet.hoKhau.maHoKhau}</td>
                                <td>{chiTiet.hoKhau.chuHo}</td>
                                <td>{chiTiet.khoanThu.tenKhoanThu}</td>
                                <td>{parseFloat(chiTiet.soTienPhaiDong).toLocaleString('vi-VN')} VND</td>
                                <td>
                                    {editingChiTietId === chiTiet.id ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editSoTienDaDong}
                                            onChange={(e) => setEditSoTienDaDong(e.target.value)}
                                            style={{ width: '80px' }}
                                        />
                                    ) : (
                                        parseFloat(chiTiet.soTienDaDong).toLocaleString('vi-VN') + ' VND'
                                    )}
                                </td>
                                <td>
                                    {editingChiTietId === chiTiet.id ? (
                                        <select
                                            value={editTrangThaiDong}
                                            onChange={(e) => setEditTrangThaiDong(e.target.value)}
                                            style={{ width: '120px' }}
                                        >
                                            <option value="Chưa đóng">Chưa đóng</option>
                                            <option value="Đã đóng một phần">Đã đóng một phần</option>
                                            <option value="Đã đóng đủ">Đã đóng đủ</option>
                                        </select>
                                    ) : (
                                        <span className={`status-badge status-${chiTiet.trangThaiDong.replace(/\s/g, '-').toLowerCase()}`}>
                                            {chiTiet.trangThaiDong}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {editingChiTietId === chiTiet.id ? (
                                        <input
                                            type="date"
                                            value={editNgayDong}
                                            onChange={(e) => setEditNgayDong(e.target.value)}
                                            style={{ width: '120px' }}
                                        />
                                    ) : (
                                        chiTiet.ngayDong ? new Date(chiTiet.ngayDong).toLocaleDateString() : 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingChiTietId === chiTiet.id ? (
                                        <input
                                            type="text"
                                            value={editGhiChu}
                                            onChange={(e) => setEditGhiChu(e.target.value)}
                                            style={{ width: '100px' }}
                                        />
                                    ) : (
                                        chiTiet.ghiChu || 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingChiTietId === chiTiet.id ? (
                                        <>
                                            <button onClick={() => handleUpdateChiTiet(chiTiet.id)} className="btn btn-primary btn-sm">Lưu</button>
                                            <button onClick={() => setEditingChiTietId(null)} className="btn btn-secondary btn-sm" style={{ marginLeft: '5px' }}>Hủy</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleEditClick(chiTiet)} className="btn btn-info btn-sm">Sửa</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ChiTietThuPhiList;