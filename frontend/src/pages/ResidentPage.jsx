import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pages.css';

function ResidentPage() {
    const [residents, setResidents] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        gender: '',
        cic: '',
        address_number: '',
        status: '',
        status_date: '',
        email: '',
        phoneNumber: ''
    });
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');

    const fetchResidents = async () => {
        try {
            const res = await axios.get('/api/v1/residents/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setResidents(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                status_date: formData.status_date && !isNaN(new Date(formData.status_date))
                    ? formData.status_date
                    : null
            };

            await axios.post('/api/v1/residents', payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            alert('Thêm nhân khẩu thành công');
            setFormData({ name: '', dob: '', gender: '', cic: '', address_number: '', status: '', status_date: '', email: '', phoneNumber: '' });
            fetchResidents();
        } catch (err) {
            console.error('Lỗi thêm nhân khẩu:', err.response?.data || err.message);
            alert('Thêm thất bại: ' + (err.response?.data?.message || 'Lỗi không xác định'));
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditing(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`/api/v1/residents/${editing.id}`, editing, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setEditing(null);
            fetchResidents();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xoá nhân khẩu này?')) return;
        try {
            await axios.delete(`/api/v1/residents/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            fetchResidents();
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = residents.filter(r =>
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.cic?.includes(search)
    );

    return (
        <div className="account-container">
            <h2 className="account-title">Quản lý Nhân khẩu</h2>

            <div className="search-wrapper">
                <input
                    placeholder="Tìm kiếm theo tên hoặc CMND"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <form onSubmit={handleSubmit} className="account-form">
                <h4>Thêm nhân khẩu mới</h4>
                <div className="form-grid">
                    <input name="name" placeholder="Họ tên" value={formData.name} onChange={handleChange} required />
                    <input name="dob" type="date" placeholder="Ngày sinh" value={formData.dob} onChange={handleChange} required />
                    <input name="gender" placeholder="Giới tính" value={formData.gender} onChange={handleChange} required />
                    <input name="cic" placeholder="CMND/CCCD" value={formData.cic} onChange={handleChange} required />
                    <input name="address_number" placeholder="Mã địa chỉ" value={formData.address_number} onChange={handleChange} required />
                    <input name="status" placeholder="Tình trạng cư trú" value={formData.status} onChange={handleChange} />
                    <input name="status_date" type="date" placeholder="Ngày cập nhật tình trạng" value={formData.status_date} onChange={handleChange} />
                    <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input name="phoneNumber" placeholder="SĐT" value={formData.phoneNumber} onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-btn">Thêm nhân khẩu</button>
            </form>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Họ tên</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>CMND/CCCD</th>
                            <th>Email</th>
                            <th>SĐT</th>
                            <th>Mã địa chỉ</th>
                            <th>Tình trạng</th>
                            <th>Ngày cập nhật</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(res => (
                            <tr key={res.id}>
                                <td>{editing?.id === res.id ? <input name="name" value={editing.name} onChange={handleEditChange} /> : res.name}</td>
                                <td>{editing?.id === res.id ? <input name="dob" type="date" value={editing.dob} onChange={handleEditChange} /> : res.dob}</td>
                                <td>{editing?.id === res.id ? <input name="gender" value={editing.gender} onChange={handleEditChange} /> : res.gender}</td>
                                <td>{editing?.id === res.id ? <input name="cic" value={editing.cic} onChange={handleEditChange} /> : res.cic}</td>
                                <td>{editing?.id === res.id ? <input name="email" value={editing.email} onChange={handleEditChange} /> : res.email}</td>
                                <td>{editing?.id === res.id ? <input name="phoneNumber" value={editing.phoneNumber} onChange={handleEditChange} /> : res.phoneNumber}</td>
                                <td>{editing?.id === res.id ? <input name="address_number" value={editing.address_number} onChange={handleEditChange} /> : res.address_number}</td>
                                <td>{editing?.id === res.id ? <input name="status" value={editing.status} onChange={handleEditChange} /> : res.status}</td>
                                <td>{editing?.id === res.id ? <input name="status_date" type="date" value={editing.status_date} onChange={handleEditChange} /> : res.status_date}</td>
                                <td>
                                    {editing?.id === res.id ? (
                                        <>
                                            <button onClick={handleEditSubmit}>Lưu</button>
                                            <button onClick={() => setEditing(null)}>Huỷ</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditing(res)}>Sửa</button>
                                            <button onClick={() => handleDelete(res.id)}>Xoá</button>
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

export default ResidentPage;
