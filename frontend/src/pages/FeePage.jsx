import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pages.css';

function FeePage() {
    const [fees, setFees] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        description: '',
        type: '',
        due_date: '',
        status: 'active'
    });
    const [editing, setEditing] = useState(null);

    const fetchFees = async () => {
        try {
            const res = await axios.get('/api/fees');
            setFees(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchFees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/fees', formData);
            alert('Thêm khoản thu thành công');
            setFormData({ name: '', amount: '', description: '', type: '', due_date: '', status: 'active' });
            fetchFees();
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
            await axios.put(`/api/fees/${editing.id}`, editing);
            setEditing(null);
            fetchFees();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xoá khoản thu này?')) return;
        try {
            await axios.delete(`/api/fees/${id}`);
            fetchFees();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="account-container">
            <h2 className="account-title">Quản lý Khoản thu</h2>

            <form onSubmit={handleSubmit} className="account-form">
                <h4>Thêm khoản thu mới</h4>
                <div className="form-grid">
                    <input name="name" placeholder="Tên khoản thu" value={formData.name} onChange={handleChange} required />
                    <input name="amount" type="number" placeholder="Số tiền" value={formData.amount} onChange={handleChange} required />
                    <input name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} />
                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="">Chọn loại</option>
                        <option value="monthly">Thu hàng tháng</option>
                        <option value="one-time">Thu một lần</option>
                    </select>
                    <input name="due_date" type="date" placeholder="Hạn nộp" value={formData.due_date} onChange={handleChange} required />
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="active">Đang áp dụng</option>
                        <option value="inactive">Ngừng áp dụng</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn">Thêm khoản thu</button>
            </form>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Số tiền</th>
                            <th>Loại</th>
                            <th>Hạn nộp</th>
                            <th>Trạng thái</th>
                            <th>Mô tả</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fees.map(fee => (
                            <tr key={fee.id}>
                                <td>{editing?.id === fee.id ? <input name="name" value={editing.name} onChange={handleEditChange} /> : fee.name}</td>
                                <td>{editing?.id === fee.id ? <input name="amount" type="number" value={editing.amount} onChange={handleEditChange} /> : fee.amount}</td>
                                <td>{editing?.id === fee.id ? (
                                    <select name="type" value={editing.type} onChange={handleEditChange}>
                                        <option value="monthly">Thu hàng tháng</option>
                                        <option value="one-time">Thu một lần</option>
                                    </select>
                                ) : fee.type}</td>
                                <td>{editing?.id === fee.id ? <input name="due_date" type="date" value={editing.due_date?.slice(0, 10)} onChange={handleEditChange} /> : fee.due_date?.slice(0, 10)}</td>
                                <td>{editing?.id === fee.id ? (
                                    <select name="status" value={editing.status} onChange={handleEditChange}>
                                        <option value="active">Đang áp dụng</option>
                                        <option value="inactive">Ngừng áp dụng</option>
                                    </select>
                                ) : fee.status}</td>
                                <td>{editing?.id === fee.id ? <input name="description" value={editing.description} onChange={handleEditChange} /> : fee.description}</td>
                                <td>
                                    {editing?.id === fee.id ? (
                                        <>
                                            <button onClick={handleEditSubmit}>Lưu</button>
                                            <button onClick={() => setEditing(null)}>Huỷ</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditing(fee)}>Sửa</button>
                                            <button onClick={() => handleDelete(fee.id)}>Xoá</button>
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

export default FeePage;