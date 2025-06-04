// quan-ly-chung-cu/src/components/HoKhau/NhanKhauManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddNhanKhau from './NhanKhau/AddNhanKhau';
import EditNhanKhau from './NhanKhau/EditNhanKhau';
import DeleteNhanKhau from './NhanKhau/DeleteNhanKhau';
// import QueryNhanKhau from './NhanKhau/QueryNhanKhau'; // Tích hợp vào list
// import ThongKeNhanKhau (nếu có)

const NhanKhauManagement = ({ hoKhau, onBackToList }) => {
    const [nhanKhaus, setNhanKhaus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentNhanKhauView, setCurrentNhanKhauView] = useState('list'); // 'list', 'add', 'edit', 'delete'
    const [selectedNhanKhau, setSelectedNhanKhau] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State cho tìm kiếm nhân khẩu

    const fetchNhanKhaus = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            // Lấy danh sách nhân khẩu dựa trên hoKhau.id
            const res = await axios.get(`http://localhost:5000/api/nhan-khau/${hoKhau.id}`, {
                headers: {
                    'x-auth-token': token,
                },
            });
            setNhanKhaus(res.data);
        } catch (err) {
            console.error('Lỗi khi tải danh sách nhân khẩu:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Không thể tải danh sách nhân khẩu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hoKhau && hoKhau.id) {
            fetchNhanKhaus();
        }
    }, [hoKhau]); // Load lại khi hoKhau thay đổi

    const handleActionSuccess = () => {
        setCurrentNhanKhauView('list'); // Quay về danh sách nhân khẩu
        setSelectedNhanKhau(null);
        fetchNhanKhaus(); // Tải lại danh sách nhân khẩu
        // Không cần gọi onBackToList ở đây, vì đây là quản lý nhân khẩu, không phải hộ khẩu
    };

    const handleCancelNhanKhau = () => {
        setCurrentNhanKhauView('list');
        setSelectedNhanKhau(null);
    };

    // Lọc danh sách nhân khẩu dựa trên searchTerm
    const filteredNhanKhaus = nhanKhaus.filter(nhanKhau =>
        nhanKhau.hoVaTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (nhanKhau.cmndCcid && nhanKhau.cmndCcid.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    const renderNhanKhauContent = () => {
        switch (currentNhanKhauView) {
            case 'add':
                return <AddNhanKhau hoKhauId={hoKhau.id} onNhanKhauAdded={handleActionSuccess} onCancel={handleCancelNhanKhau} />;
            case 'edit':
                return <EditNhanKhau nhanKhau={selectedNhanKhau} onNhanKhauUpdated={handleActionSuccess} onCancel={handleCancelNhanKhau} />;
            case 'delete':
                return <DeleteNhanKhau nhanKhau={selectedNhanKhau} onNhanKhauDeleted={handleActionSuccess} onCancel={handleCancelNhanKhau} />;
            case 'list':
            default:
                return (
                    <div className="list-container">
                        <h3>Nhân khẩu của Hộ khẩu: {hoKhau.maHoKhau} ({hoKhau.chuHo})</h3>
                        <p>Địa chỉ: {hoKhau.diaChi}</p>
                        <p>Số thành viên: {hoKhau.soThanhVien}</p>

                        <button onClick={() => setCurrentNhanKhauView('add')} className="btn btn-success">Thêm Nhân khẩu mới</button>
                        <button onClick={onBackToList} className="btn btn-secondary" style={{ marginLeft: '10px' }}>Quay lại danh sách Hộ khẩu</button>

                        {/* Thanh tìm kiếm */}
                        <div className="search-bar" style={{ marginTop: '20px', marginBottom: '20px' }}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo họ tên, CMND/CCCD..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                            />
                        </div>

                        {loading ? (
                            <p>Đang tải danh sách nhân khẩu...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : filteredNhanKhaus.length === 0 ? (
                            <p>Chưa có nhân khẩu nào trong hộ khẩu này hoặc không tìm thấy kết quả.</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Họ và tên</th>
                                        <th>Giới tính</th>
                                        <th>Ngày sinh</th>
                                        <th>CMND/CCCD</th>
                                        <th>Quan hệ với chủ hộ</th>
                                        <th>Nơi làm việc</th>
                                        <th>Ngày chuyển đến</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNhanKhaus.map((nhanKhau) => (
                                        <tr key={nhanKhau.id}>
                                            <td>{nhanKhau.hoVaTen}</td>
                                            <td>{nhanKhau.gioiTinh}</td>
                                            <td>{new Date(nhanKhau.ngaySinh).toLocaleDateString()}</td>
                                            <td>{nhanKhau.cmndCcid}</td>
                                            <td>{nhanKhau.quanHeVoiChuHo}</td>
                                            <td>{nhanKhau.noiLamViec}</td>
                                            <td>{new Date(nhanKhau.ngayChuyenDen).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    onClick={() => { setSelectedNhanKhau(nhanKhau); setCurrentNhanKhauView('edit'); }}
                                                    className="btn btn-info"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedNhanKhau(nhanKhau); setCurrentNhanKhauView('delete'); }}
                                                    className="btn btn-danger"
                                                    style={{ marginLeft: '10px' }}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );
        }
    };

    return <div className="nhan-khau-management">{renderNhanKhauContent()}</div>;
};

export default NhanKhauManagement;