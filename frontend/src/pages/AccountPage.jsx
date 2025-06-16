import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pages.css';

function AccountPage() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'accountant',
        phoneNumber: '',
        is_active: '1' // ✅ ENUM '1' = true
    });
    const [editing, setEditing] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/v1/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setUsers(res.data.data);
        } catch (err) {
            console.error('Lỗi fetchUsers:', err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/v1/users', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            alert('Tạo tài khoản thành công');
            setFormData({
                email: '',
                password: '',
                name: '',
                role: 'accountant',
                phoneNumber: '',
                is_active: '1'
            });
            fetchUsers();
        } catch (err) {
            console.error('Lỗi tạo tài khoản:', err.response?.data || err.message);
            alert('Tạo tài khoản thất bại: ' + (err.response?.data?.message || 'Lỗi không xác định'));
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditing(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`/api/v1/users/${editing.id}`, editing, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setEditing(null);
            fetchUsers();
        } catch (err) {
            console.error('Lỗi cập nhật tài khoản:', err.response?.data || err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xoá tài khoản này?')) return;
        try {
            await axios.delete(`/api/v1/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            fetchUsers();
        } catch (err) {
            console.error('Lỗi xoá tài khoản:', err.response?.data || err.message);
        }
    };

    return (
        <div className="account-container">
            <h2 className="account-title">Quản lý tài khoản</h2>

            <form onSubmit={handleSubmit} className="account-form">
                <h4>Tạo tài khoản mới</h4>
                <div className="form-grid">
                    <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input name="password" type="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} required />
                    <input name="name" placeholder="Tên" value={formData.name} onChange={handleChange} required />
                    <input name="phoneNumber" placeholder="SĐT" value={formData.phoneNumber} onChange={handleChange} />
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="admin">Quản trị viên</option>
                        <option value="accountant">Kế toán</option>
                    </select>
                    <select name="is_active" value={formData.is_active} onChange={handleChange}>
                        <option value="1">Kích hoạt</option>
                        <option value="0">Vô hiệu hoá</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn">Tạo tài khoản</button>
            </form>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Tên</th>
                            <th>Vai trò</th>
                            <th>SĐT</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{editing?.id === user.id ? <input name="email" value={editing.email} onChange={handleEditChange} /> : user.email}</td>
                                <td>{editing?.id === user.id ? <input name="name" value={editing.name} onChange={handleEditChange} /> : user.name}</td>
                                <td>{editing?.id === user.id ? (
                                    <select name="role" value={editing.role} onChange={handleEditChange}>
                                        <option value="admin">Quản trị viên</option>
                                        <option value="accountant">Kế toán</option>
                                    </select>
                                ) : user.role}</td>
                                <td>{editing?.id === user.id ? <input name="phoneNumber" value={editing.phoneNumber} onChange={handleEditChange} /> : user.phoneNumber}</td>
                                <td>{editing?.id === user.id ? (
                                    <select
                                        name="is_active"
                                        value={editing.is_active}
                                        onChange={handleEditChange}
                                    >
                                        <option value="1">Kích hoạt</option>
                                        <option value="0">Vô hiệu hoá</option>
                                    </select>
                                ) : user.is_active === '1' ? 'Kích hoạt' : 'Vô hiệu hoá'}</td>
                                <td>
                                    {editing?.id === user.id ? (
                                        <>
                                            <button onClick={handleEditSubmit}>Lưu</button>
                                            <button onClick={() => setEditing(null)}>Huỷ</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditing(user)}>Sửa</button>
                                            <button onClick={() => handleDelete(user.id)}>Xoá</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AccountPage;
