// quan-ly-chung-cu/src/components/DotThuPhiManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddDotThuPhi from './DotThuPhi/AddDotThuPhi';
import EditDotThuPhi from './DotThuPhi/EditDotThuPhi';
import DeleteDotThuPhi from './DotThuPhi/DeleteDotThuPhi';
import ChiTietThuPhiList from './DotThuPhi/ChiTietThuPhiList'; // Component mới để hiển thị chi tiết thu phí

const DotThuPhiManagement = () => {
    const [dotThuPhis, setDotThuPhis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit', 'delete', 'viewDetails'
    const [selectedDotThuPhi, setSelectedDotThuPhi] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State cho tìm kiếm

    const fetchDotThuPhis = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/dot-thu-phi', {
                headers: {
                    'x-auth-token': token,
                },
            });
            setDotThuPhis(res.data);
        } catch (err) {
            console.error('Lỗi khi tải danh sách đợt thu phí:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Không thể tải danh sách đợt thu phí.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDotThuPhis();
    }, []);

    const handleActionSuccess = () => {
        setCurrentView('list');
        setSelectedDotThuPhi(null);
        fetchDotThuPhis(); // Tải lại danh sách sau khi hành động
    };

    const handleCancel = () => {
        setCurrentView('list');
        setSelectedDotThuPhi(null);
    };

    const handleGenerateReceipts = async (dotThuPhiId) => {
        if (window.confirm('Bạn có chắc chắn muốn lập danh sách thu phí cho đợt này không? Thao tác này sẽ cập nhật lại số tiền phải đóng cho tất cả hộ khẩu dựa trên cấu hình hiện tại và xóa các chi tiết thu phí cũ của đợt này.')) {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.post(
                    `http://localhost:5000/api/dot-thu-phi/${dotThuPhiId}/generate-receipts`,
                    {},
                    {
                        headers: {
                            'x-auth-token': token,
                        },
                    }
                );
                alert(res.data.msg);
                fetchDotThuPhis(); // Cập nhật lại danh sách để hiển thị tổng tiền dự kiến
            } catch (err) {
                console.error('Lỗi khi lập danh sách thu phí:', err.response ? err.response.data : err.message);
                alert(`Lỗi: ${err.response?.data?.msg || 'Đã xảy ra lỗi khi lập danh sách thu phí.'}`);
            }
        }
    };


    const filteredDotThuPhis = dotThuPhis.filter(dot =>
        dot.tenDotThu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dot.moTa && dot.moTa.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const renderContent = () => {
        switch (currentView) {
            case 'add':
                return <AddDotThuPhi onDotThuPhiAdded={handleActionSuccess} onCancel={handleCancel} />;
            case 'edit':
                return <EditDotThuPhi dotThuPhi={selectedDotThuPhi} onDotThuPhiUpdated={handleActionSuccess} onCancel={handleCancel} />;
            case 'delete':
                return <DeleteDotThuPhi dotThuPhi={selectedDotThuPhi} onDotThuPhiDeleted={handleActionSuccess} onCancel={handleCancel} />;
            case 'viewDetails':
                return <ChiTietThuPhiList dotThuPhi={selectedDotThuPhi} onBackToList={handleActionSuccess} />;
            case 'list':
            default:
                return (
                    <div className="list-container">
                        <h3>Quản lý Đợt thu phí</h3>
                        <button onClick={() => setCurrentView('add')} className="btn btn-success">Tạo Đợt thu phí mới</button>

                        {/* Thanh tìm kiếm */}
                        <div className="search-bar" style={{ marginTop: '20px', marginBottom: '20px' }}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên đợt thu, mô tả..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                            />
                        </div>

                        {loading ? (
                            <p>Đang tải danh sách đợt thu phí...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : filteredDotThuPhis.length === 0 ? (
                            <p>Chưa có đợt thu phí nào hoặc không tìm thấy kết quả.</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tên đợt thu</th>
                                        <th>Mô tả</th>
                                        <th>Ngày bắt đầu</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Trạng thái</th>
                                        <th>Các khoản thu</th>
                                        <th>Tổng dự kiến</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDotThuPhis.map((dot) => (
                                        <tr key={dot.id}>
                                            <td>{dot.tenDotThu}</td>
                                            <td>{dot.moTa || 'N/A'}</td>
                                            <td>{new Date(dot.ngayBatDau).toLocaleDateString()}</td>
                                            <td>{new Date(dot.ngayKetThuc).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-badge status-${dot.trangThai.replace(/\s/g, '-').toLowerCase()}`}>
                                                    {dot.trangThai}
                                                </span>
                                            </td>
                                            <td>
                                                {dot.khoanThus && dot.khoanThus.length > 0 ? (
                                                    <ul>
                                                        {dot.khoanThus.map((kt) => (
                                                            <li key={kt.id}>{kt.tenKhoanThu} ({parseFloat(kt.DotThuPhiKhoanThu.giaTriApDung).toLocaleString('vi-VN')} VND {kt.donVi})</li>
                                                        ))}
                                                    </ul>
                                                ) : 'Chưa có'}
                                            </td>
                                            <td>{parseFloat(dot.tongTienDuKien).toLocaleString('vi-VN')} VND</td>
                                            <td>
                                                <button
                                                    onClick={() => handleGenerateReceipts(dot.id)}
                                                    className="btn btn-success"
                                                    style={{ marginBottom: '5px' }}
                                                    disabled={dot.trangThai === 'Đã kết thúc'} // Không cho lập danh sách khi đã kết thúc
                                                >
                                                    Lập DS Thu
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedDotThuPhi(dot); setCurrentView('viewDetails'); }}
                                                    className="btn btn-primary"
                                                    style={{ marginLeft: '5px', marginBottom: '5px' }}
                                                >
                                                    Xem chi tiết thu
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedDotThuPhi(dot); setCurrentView('edit'); }}
                                                    className="btn btn-info"
                                                    style={{ marginLeft: '5px', marginBottom: '5px' }}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedDotThuPhi(dot); setCurrentView('delete'); }}
                                                    className="btn btn-danger"
                                                    style={{ marginLeft: '5px', marginBottom: '5px' }}
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

    return <div className="dot-thu-phi-management">{renderContent()}</div>;
};

export default DotThuPhiManagement;