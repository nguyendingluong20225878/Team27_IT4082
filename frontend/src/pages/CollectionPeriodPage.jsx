import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pages.css';

function CollectionPeriodPage() {
    const [invoices, setInvoices] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editing, setEditing] = useState(null);

    const fetchInvoices = async () => {
        try {
            const res = await axios.get('/api/invoices');
            setInvoices(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/invoices', formData);
            alert('Tạo đợt thu thành công');
            setFormData({ name: '', description: '' });
            fetchInvoices();
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
            await axios.put(`/api/invoices/${editing.id}`, editing);
            setEditing(null);
            fetchInvoices();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xoá đợt thu này?')) return;
        try {
            await axios.delete(`/api/invoices/${id}`);
            fetchInvoices();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="account-container">
            <h2 className="account-title">Quản lý Đợt thu</h2>

            <form onSubmit={handleSubmit} className="account-form">
                <h4>Tạo đợt thu mới</h4>
                <div className="form-grid">
                    <input name="name" placeholder="Tên đợt thu" value={formData.name} onChange={handleChange} required />
                    <input name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} />
                </div>
                <button type="submit" className="submit-btn">Tạo</button>
            </form>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Tên đợt thu</th>
                            <th>Mô tả</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td>{editing?.id === invoice.id ? <input name="name" value={editing.name} onChange={handleEditChange} /> : invoice.name}</td>
                                <td>{editing?.id === invoice.id ? <input name="description" value={editing.description} onChange={handleEditChange} /> : invoice.description}</td>
                                <td>
                                    {editing?.id === invoice.id ? (
                                        <>
                                            <button onClick={handleEditSubmit}>Lưu</button>
                                            <button onClick={() => setEditing(null)}>Huỷ</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setEditing(invoice)}>Sửa</button>
                                            <button onClick={() => handleDelete(invoice.id)}>Xoá</button>
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

export default CollectionPeriodPage;
