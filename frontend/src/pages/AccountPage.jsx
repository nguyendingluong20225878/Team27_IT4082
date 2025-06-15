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
        phoneNumber: ''
    });
    const [editing, setEditing] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/users');
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
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
            await axios.post('/api/users', formData);
            alert('Tạo tài khoản thành công');
            setFormData({ email: '', password: '', name: '', role: 'accountant', phoneNumber: '' });
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditing(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`/api/users/${editing.id}`, editing);
            setEditing(null);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xoá tài khoản này?')) return;
        try {
            await axios.delete(`/api/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error(err);
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
                                    <select name="is_active" value={editing.is_active ? 'true' : 'false'} onChange={e => handleEditChange({ target: { name: 'is_active', value: e.target.value === 'true' } })}>
                                        <option value="true">Kích hoạt</option>
                                        <option value="false">Vô hiệu hoá</option>
                                    </select>
                                ) : user.is_active ? 'Kích hoạt' : 'Vô hiệu hoá'}</td>
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
