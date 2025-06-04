// quan-ly-chung-cu/src/components/TaiKhoanHeThongManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateAccount from './TaiKhoan/CreateAccount';
import EditAccount from './TaiKhoan/EditAccount';
import DeleteAccount from './TaiKhoan/DeleteAccount';
import AssignPermissions from './TaiKhoan/AssignPermissions'; // Dùng component này nếu bạn muốn giữ nó

const TaiKhoanHeThongManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'delete', 'assign'
    const [selectedAccount, setSelectedAccount] = useState(null);

    const fetchAccounts = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: {
                    'x-auth-token': token,
                },
            });
            setAccounts(res.data);
        } catch (err) {
            console.error('Lỗi khi tải danh sách tài khoản:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Không thể tải danh sách tài khoản.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleCreated = () => {
        setCurrentView('list');
        fetchAccounts(); // Tải lại danh sách sau khi tạo
    };

    const handleUpdated = () => {
        setCurrentView('list');
        fetchAccounts(); // Tải lại danh sách sau khi cập nhật
    };

    const handleDeleted = () => {
        setCurrentView('list');
        fetchAccounts(); // Tải lại danh sách sau khi xóa
    };

    const handleCancel = () => {
        setCurrentView('list');
        setSelectedAccount(null);
    };

    const renderContent = () => {
        switch (currentView) {
            case 'create':
                return <CreateAccount onAccountCreated={handleCreated} onCancel={handleCancel} />;
            case 'edit':
                return <EditAccount account={selectedAccount} onAccountUpdated={handleUpdated} onCancel={handleCancel} />;
            case 'delete':
                return <DeleteAccount account={selectedAccount} onAccountDeleted={handleDeleted} onCancel={handleCancel} />;
            case 'assign': // Nếu bạn quyết định giữ AssignPermissions riêng
                return <AssignPermissions onCancel={handleCancel} />;
            case 'list':
            default:
                return (
                    <div className="list-container">
                        <h3>Danh sách Tài khoản</h3>
                        <button onClick={() => setCurrentView('create')} className="btn btn-success">Tạo tài khoản mới</button>
                        {loading ? (
                            <p>Đang tải...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : accounts.length === 0 ? (
                            <p>Chưa có tài khoản nào.</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tên đăng nhập</th>
                                        <th>Vai trò</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts.map((account) => (
                                        <tr key={account.id}>
                                            <td>{account.username}</td>
                                            <td>{account.role}</td>
                                            <td>
                                                <button
                                                    onClick={() => { setSelectedAccount(account); setCurrentView('edit'); }}
                                                    className="btn btn-info"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedAccount(account); setCurrentView('delete'); }}
                                                    className="btn btn-danger"
                                                    style={{ marginLeft: '10px' }}
                                                >
                                                    Xóa
                                                </button>
                                                {/* Nếu bạn muốn nút phân quyền riêng */}
                                                {/* <button
                            onClick={() => { setSelectedAccount(account); setCurrentView('assign'); }}
                            className="btn btn-warning"
                            style={{ marginLeft: '10px' }}
                        >
                            Phân quyền
                        </button> */}
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

    return <div className="tai-khoan-management">{renderContent()}</div>;
};

export default TaiKhoanHeThongManagement;