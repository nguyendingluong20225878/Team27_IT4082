import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pages.css';

function HouseholdPage() {
    const [apartments, setApartments] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        address_number: '',
        area: '',
        status: 'Resident'
    });
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');

    const fetchApartments = async () => {
        try {
            const res = await axios.get('/api/apartments/info?page=1');
            setApartments(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchApartments();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/apartments', [formData]);
            alert('Thêm hộ khẩu thành công');
            setFormData({ id: '', address_number: '', area: '', status: 'Resident' });
            fetchApartments();
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
            await axios.put(`/api/apartments/${editing.id}`, editing);
            setEditing(null);
            fetchApartments();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xoá hộ khẩu này?')) return;
        try {
            await axios.delete(`/api/apartments/${id}`);
            fetchApartments();
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = apartments.filter(a =>
        a.address_number.toString().includes(search) ||
        a.id.toString().includes(search)
    );

    return (
        <div className="account-container">
            <h2 className="account-title">Quản lý Hộ khẩu</h2>

            <div className="search-wrapper">
                <input
                    placeholder="Tìm kiếm theo địa chỉ hoặc mã hộ"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <form onSubmit={handleSubmit} className="account-form">
                <h4>Thêm hộ khẩu mới</h4>
                <div className="form-grid">
                    <input name="id" placeholder="Mã hộ (id)" value={formData.id} onChange={handleChange} required />
                    <input name="address_number" placeholder="Địa chỉ số" value={formData.address_number} onChange={handleChange} required />
                    <input name="area" placeholder="Diện tích" value={formData.area} onChange={handleChange} required />
                    <select name="status" value={formData.status} onChange={handleChange} required>
                        <option value="Resident">Resident</option>
                        <option value="Business">Business</option>
                        <option value="Vacant">Vacant</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn">Thêm hộ khẩu</button>
            </form>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Mã hộ</th>
                            <th>Địa chỉ</th>
                            <th>Diện tích</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(apt => (
                            <tr key={apt.id}>
                                <td>{editing?.id === apt.id ? <input name="id" value={editing.id} disabled /> : apt.id}</td>
                                <td>{editing?.id === apt.id ? <input name="address_number" value={editing.address_number} onChange={handleEditChange} /> : apt.address_number}</td>
                                <td>{editing?.id === apt.id ? <input name="area" value={editing.area} onChange={handleEditChange} /> : apt.area}</td>
                                <td>{editing?.id === apt.id ? (
                                    <select name="status" value={editing.status} onChange={handleEditChange}>
                                        <option value="Resident">Resident</option>
                                        <option value="Business">Business</option>
                                        <option value="Vacant">Vacant</option>
                                    </select>
                                ) : apt.status}</td>
                                <td>
                                    {editing?.id === apt.id ? (
                                        <>
                                            <button onClick={handleEditSubmit}>Lưu</button>
                                            <button onClick={() => setEditing(null)}>Huỷ</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditing(apt)}>Sửa</button>
                                            <button onClick={() => handleDelete(apt.id)}>Xoá</button>
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

export default HouseholdPage;
