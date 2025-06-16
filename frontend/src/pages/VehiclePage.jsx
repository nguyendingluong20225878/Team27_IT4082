import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pages.css';

function VehiclePage() {
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({
        license_plate: '', // Giữ nguyên snake_case cho form input (req.body)
        type: '',
        apartment_id: ''   // Giữ nguyên snake_case cho form input (req.body)
    });
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/vehicles', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            // Dữ liệu nhận từ backend sẽ có các thuộc tính là camelCase (licensePlate, apartmentId)
            // do Sequelize mặc định ánh xạ từ snake_case của DB
            setVehicles(res.data.data || []);
        } catch (err) {
            console.error(err);
            alert('Lỗi khi lấy danh sách phương tiện: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
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
        setLoading(true);
        try {
            await axios.post('/api/v1/vehicles', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            alert('Thêm phương tiện thành công');
            setFormData({ license_plate: '', type: '', apartment_id: '' });
            fetchVehicles();
        } catch (err) {
            console.error(err);
            alert('Lỗi khi thêm phương tiện: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xoá phương tiện này không?')) return;
        setLoading(true);
        try {
            await axios.delete(`/api/v1/vehicles/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            alert('Xoá phương tiện thành công');
            fetchVehicles();
        } catch (err) {
            console.error(err);
            alert('Lỗi khi xoá phương tiện: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (v) => {
        // Khi chỉnh sửa, gán giá trị từ thuộc tính camelCase của `v`
        // vào các trường snake_case của `editing` để khớp với input names
        setEditing({
            ...v,
            license_plate: v.licensePlate, // LẤY TỪ licensePlate (camelCase) của object v
            apartment_id: v.apartmentId   // LẤY TỪ apartmentId (camelCase) của object v
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditing(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async () => {
        setLoading(true);
        try {
            const { id, license_plate, type, apartment_id } = editing;
            // Gửi camelCase (licensePlate, apartmentId) cho backend updateVehicle
            await axios.put(`/api/v1/vehicles/${id}`, {
                licensePlate: license_plate, // Gửi license_plate (từ form) dưới tên licensePlate
                type,
                apartmentId: apartment_id    // Gửi apartment_id (từ form) dưới tên apartmentId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            alert('Cập nhật phương tiện thành công');
            setEditing(null);
            fetchVehicles();
        } catch (err) {
            console.error(err);
            alert('Lỗi khi cập nhật phương tiện: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Lọc theo cả licensePlate và apartmentId (camelCase) vì dữ liệu nhận được từ backend là camelCase
    const filtered = vehicles.filter(v =>
        v.licensePlate?.toLowerCase().includes(search.toLowerCase()) || // SỬA ĐỔI Ở ĐÂY
        v.apartmentId?.toString().includes(search) // SỬA ĐỔI Ở ĐÂY
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
                    <input name="license_plate" placeholder="Biển số xe" value={formData.license_plate} onChange={handleChange} required />
                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="">Chọn loại xe</option>
                        <option value="motorcycle">Xe máy</option>
                        <option value="car">Ô tô</option>
                        <option value="bicycle">Xe đạp</option>
                    </select>
                    <input name="apartment_id" placeholder="Mã hộ (apartment_id)" value={formData.apartment_id} onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Đang thêm...' : 'Thêm phương tiện'}
                </button>
            </form>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Biển số</th>
                            <th>Loại</th>
                            <th>Mã hộ</th>
                            <th>Phí gửi xe</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && filtered.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Không tìm thấy phương tiện nào.</td></tr>
                        ) : (
                            filtered.map(v => (
                                <tr key={v.id}>
                                    {/* SỬA ĐỔI Ở ĐÂY: Hiển thị v.licensePlate (camelCase) */}
                                    <td>{editing?.id === v.id ? <input name="license_plate" value={editing.license_plate} onChange={handleEditChange} /> : v.licensePlate}</td>
                                    <td>{editing?.id === v.id ? (
                                        <select name="type" value={editing.type} onChange={handleEditChange}>
                                            <option value="motorcycle">Xe máy</option>
                                            <option value="car">Ô tô</option>
                                            <option value="bicycle">Xe đạp</option>
                                        </select>
                                    ) : v.type}</td>
                                    {/* SỬA ĐỔI Ở ĐÂY: Hiển thị v.apartmentId (camelCase) */}
                                    <td>{editing?.id === v.id ? <input name="apartment_id" value={editing.apartment_id} onChange={handleEditChange} /> : v.apartmentId}</td>
                                    <td>{v.amount} đ</td>
                                    <td>
                                        {editing?.id === v.id ? (
                                            <>
                                                <button onClick={handleEditSubmit} disabled={loading}>Lưu</button>
                                                <button onClick={() => setEditing(null)} disabled={loading}>Huỷ</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditClick(v)} disabled={loading}>Sửa</button>
                                                <button onClick={() => handleDelete(v.id)} disabled={loading}>Xoá</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VehiclePage;