import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pages.css';

function VehiclePage() {
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({ licensePlate: '', type: '', apartment_id: '', status: 'active' });
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');

    const fetchVehicles = async () => {
        try {
            const res = await axios.get('/api/vehicles');
            setVehicles(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/vehicles', formData);
            alert('Thêm phương tiện thành công');
            setFormData({ licensePlate: '', type: '', apartment_id: '', status: 'active' });
            fetchVehicles();
        } catch (err) {
            console.error(err);
            alert('Lỗi khi thêm phương tiện');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xoá phương tiện này?')) return;
        try {
            await axios.delete(`/api/vehicles/${id}`);
            fetchVehicles();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (v) => {
        setEditing({ ...v });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditing({ ...editing, [name]: value });
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`/api/vehicles/${editing.id}`, editing);
            setEditing(null);
            fetchVehicles();
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = vehicles.filter(v =>
        v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
        v.apartment_id?.toString().includes(search)
    );

    return (
        <div className="account-container">
            <h2 className="account-title">Quản lý Phương tiện</h2>

            <div className="search-wrapper">
                <input
                    placeholder="Tìm kiếm theo biển số hoặc mã hộ"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <form onSubmit={handleSubmit} className="account-form">
                <h4>Thêm phương tiện</h4>
                <div className="form-grid">
                    <input name="licensePlate" placeholder="Biển số xe" value={formData.licensePlate} onChange={handleChange} required />
                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="">Chọn loại xe</option>
                        <option value="motorcycle">Xe máy</option>
                        <option value="car">Ô tô</option>
                        <option value="bicycle">Xe đạp</option>
                    </select>
                    <input name="apartment_id" placeholder="Mã hộ (apartment_id)" value={formData.apartment_id} onChange={handleChange} required />
                    <select name="status" value={formData.status} onChange={handleChange} required>
                        <option value="active">Đang sử dụng</option>
                        <option value="inactive">Ngưng sử dụng</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn">Thêm phương tiện</button>
            </form>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Biển số</th>
                            <th>Loại</th>
                            <th>Mã hộ</th>
                            <th>Phí gửi xe</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(v => (
                            <tr key={v.id}>
                                <td>{editing?.id === v.id ? <input name="licensePlate" value={editing.licensePlate} onChange={handleEditChange} /> : v.licensePlate}</td>
                                <td>{editing?.id === v.id ? (
                                    <select name="type" value={editing.type} onChange={handleEditChange}>
                                        <option value="motorcycle">Xe máy</option>
                                        <option value="car">Ô tô</option>
                                        <option value="bicycle">Xe đạp</option>
                                    </select>
                                ) : v.type}</td>
                                <td>{editing?.id === v.id ? <input name="apartment_id" value={editing.apartment_id} onChange={handleEditChange} /> : v.apartment_id}</td>
                                <td>{v.amount} đ</td>
                                <td>{editing?.id === v.id ? (
                                    <select name="status" value={editing.status} onChange={handleEditChange}>
                                        <option value="active">Đang sử dụng</option>
                                        <option value="inactive">Ngưng sử dụng</option>
                                    </select>
                                ) : v.status}</td>
                                <td>
                                    {editing?.id === v.id ? (
                                        <>
                                            <button onClick={handleEditSubmit}>Lưu</button>
                                            <button onClick={() => setEditing(null)}>Huỷ</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditClick(v)}>Sửa</button>
                                            <button onClick={() => handleDelete(v.id)}>Xoá</button>
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

export default VehiclePage;