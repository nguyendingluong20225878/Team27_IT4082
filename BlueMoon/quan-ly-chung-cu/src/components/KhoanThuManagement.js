// quan-ly-chung-cu/src/components/KhoanThuManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddKhoanThu from './KhoanThu/AddKhoanThu';
import EditKhoanThu from './KhoanThu/EditKhoanThu';
import DeleteKhoanThu from './KhoanThu/DeleteKhoanThu';

const KhoanThuManagement = () => {
    const [khoanThus, setKhoanThus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit', 'delete'
    const [selectedKhoanThu, setSelectedKhoanThu] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State cho tìm kiếm

    const fetchKhoanThus = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/khoan-thu', {
                headers: {
                    'x-auth-token': token,
                },
            });
            setKhoanThus(res.data);
        } catch (err) {
            console.error('Lỗi khi tải danh sách khoản thu:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Không thể tải danh sách khoản thu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKhoanThus();
    }, []);

    const handleActionSuccess = () => {
        setCurrentView('list');
        setSelectedKhoanThu(null);
        fetchKhoanThus();
    };

    const handleCancel = () => {
        setCurrentView('list');
        setSelectedKhoanThu(null);
    };

    const filteredKhoanThus = khoanThus.filter(khoan =>
        khoan.tenKhoanThu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (khoan.moTa && khoan.moTa.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const renderContent = () => {
        switch (currentView) {
            case 'add':
                return <AddKhoanThu onKhoanThuAdded={handleActionSuccess} onCancel={handleCancel} />;
            case 'edit':
                return <EditKhoanThu khoanThu={selectedKhoanThu} onKhoanThuUpdated={handleActionSuccess} onCancel={handleCancel} />;
            case 'delete':
                return <DeleteKhoanThu khoanThu={selectedKhoanThu} onKhoanThuDeleted={handleActionSuccess} onCancel={handleCancel} />;
            case 'list':
            default:
                return (
                    <div className="list-container">
                        <h3>Quản lý Khoản thu</h3>
                        <button onClick={() => setCurrentView('add')} className="btn btn-success">Thêm Khoản thu mới</button>

                        {/* Thanh tìm kiếm */}
                        <div className="search-bar" style={{ marginTop: '20px', marginBottom: '20px' }}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên khoản thu, mô tả..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                            />
                        </div>

                        {loading ? (
                            <p>Đang tải danh sách khoản thu...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : filteredKhoanThus.length === 0 ? (
                            <p>Chưa có khoản thu nào hoặc không tìm thấy kết quả.</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tên khoản thu</th>
                                        <th>Mô tả</th>
                                        <th>Mức phí</th>
                                        <th>Đơn vị</th>
                                        <th>Bắt buộc</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredKhoanThus.map((khoan) => (
                                        <tr key={khoan.id}>
                                            <td>{khoan.tenKhoanThu}</td>
                                            <td>{khoan.moTa || 'N/A'}</td>
                                            <td>{parseFloat(khoan.mucPhi).toLocaleString('vi-VN')} VND</td>
                                            <td>{khoan.donVi}</td>
                                            <td>{khoan.batBuoc ? 'Có' : 'Không'}</td>
                                            <td>
                                                <button
                                                    onClick={() => { setSelectedKhoanThu(khoan); setCurrentView('edit'); }}
                                                    className="btn btn-info"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedKhoanThu(khoan); setCurrentView('delete'); }}
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

    return <div className="khoan-thu-management">{renderContent()}</div>;
};

export default KhoanThuManagement;