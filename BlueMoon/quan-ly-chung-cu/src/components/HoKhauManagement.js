// quan-ly-chung-cu/src/components/HoKhauManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddHoKhau from './HoKhau/AddHoKhau';
import EditHoKhau from './HoKhau/EditHoKhau';
import DeleteHoKhau from './HoKhau/DeleteHoKhau';
// import QueryHoKhau from './HoKhau/QueryHoKhau'; // Sẽ tích hợp query vào list
// import ThongKeHoKhau from './HoKhau/ThongKeHoKhau'; // Sẽ tạo riêng nếu phức tạp
import NhanKhauManagement from './HoKhau/NhanKhauManagement'; // Component quản lý nhân khẩu


const HoKhauManagement = () => {
    const [hoKhaus, setHoKhaus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit', 'delete', 'manageNhanKhau'
    const [selectedHoKhau, setSelectedHoKhau] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State cho tìm kiếm

    const fetchHoKhaus = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/ho-khau', {
                headers: {
                    'x-auth-token': token,
                },
            });
            setHoKhaus(res.data);
        } catch (err) {
            console.error('Lỗi khi tải danh sách hộ khẩu:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Không thể tải danh sách hộ khẩu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHoKhaus();
    }, []);

    const handleActionSuccess = () => {
        setCurrentView('list'); // Quay về danh sách
        setSelectedHoKhau(null); // Bỏ chọn hộ khẩu
        fetchHoKhaus(); // Tải lại danh sách
    };

    const handleCancel = () => {
        setCurrentView('list');
        setSelectedHoKhau(null);
    };

    // Lọc danh sách hộ khẩu dựa trên searchTerm
    const filteredHoKhaus = hoKhaus.filter(hoKhau =>
        hoKhau.maHoKhau.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hoKhau.diaChi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hoKhau.chuHo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderContent = () => {
        switch (currentView) {
            case 'add':
                return <AddHoKhau onHoKhauAdded={handleActionSuccess} onCancel={handleCancel} />;
            case 'edit':
                return <EditHoKhau hoKhau={selectedHoKhau} onHoKhauUpdated={handleActionSuccess} onCancel={handleCancel} />;
            case 'delete':
                return <DeleteHoKhau hoKhau={selectedHoKhau} onHoKhauDeleted={handleActionSuccess} onCancel={handleCancel} />;
            case 'manageNhanKhau':
                return <NhanKhauManagement hoKhau={selectedHoKhau} onBackToList={handleActionSuccess} />;
            case 'list':
            default:
                return (
                    <div className="list-container">
                        <h3>Quản lý Hộ khẩu</h3>
                        <button onClick={() => setCurrentView('add')} className="btn btn-success">Thêm Hộ khẩu mới</button>

                        {/* Thanh tìm kiếm */}
                        <div className="search-bar" style={{ marginTop: '20px', marginBottom: '20px' }}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo mã hộ khẩu, địa chỉ, chủ hộ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                            />
                        </div>

                        {loading ? (
                            <p>Đang tải danh sách hộ khẩu...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : filteredHoKhaus.length === 0 ? (
                            <p>Chưa có hộ khẩu nào hoặc không tìm thấy kết quả.</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Mã Hộ khẩu</th>
                                        <th>Chủ hộ</th>
                                        <th>Địa chỉ</th>
                                        <th>Số thành viên</th>
                                        <th>Ngày lập</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHoKhaus.map((hoKhau) => (
                                        <tr key={hoKhau.id}>
                                            <td>{hoKhau.maHoKhau}</td>
                                            <td>{hoKhau.chuHo}</td>
                                            <td>{hoKhau.diaChi}</td>
                                            <td>{hoKhau.soThanhVien}</td>
                                            <td>{new Date(hoKhau.ngayLap).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    onClick={() => { setSelectedHoKhau(hoKhau); setCurrentView('manageNhanKhau'); }}
                                                    className="btn btn-primary"
                                                >
                                                    Quản lý Nhân khẩu
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedHoKhau(hoKhau); setCurrentView('edit'); }}
                                                    className="btn btn-info"
                                                    style={{ marginLeft: '10px' }}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedHoKhau(hoKhau); setCurrentView('delete'); }}
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

    return <div className="ho-khau-management">{renderContent()}</div>;
};

export default HoKhauManagement;