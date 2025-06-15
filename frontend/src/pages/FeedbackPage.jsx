import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './pages.css';

function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [formData, setFormData] = useState({ residentId: '', apartmentId: '', reportType: '', description: '' });

    const fetchFeedbacks = async () => {
        try {
            const res = await axios.get('/api/feedbacks');
            setFeedbacks(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/feedbacks', formData);
            alert('Gửi phản ánh thành công');
            setFormData({ residentId: '', apartmentId: '', reportType: '', description: '' });
            fetchFeedbacks();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="account-container">
            <h2 className="account-title">Quản lý Phản ánh</h2>

            <form onSubmit={handleSubmit} className="account-form">
                <h4>Gửi phản ánh mới</h4>
                <div className="form-grid">
                    <input name="residentId" placeholder="Mã cư dân" value={formData.residentId} onChange={handleChange} required />
                    <input name="apartmentId" placeholder="Mã căn hộ" value={formData.apartmentId} onChange={handleChange} required />
                    <input name="reportType" placeholder="Loại phản ánh" value={formData.reportType} onChange={handleChange} required />
                    <input name="description" placeholder="Nội dung phản ánh" value={formData.description} onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-btn">Gửi phản ánh</button>
            </form>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Tên cư dân</th>
                            <th>Email</th>
                            <th>SĐT</th>
                            <th>Căn hộ</th>
                            <th>Loại</th>
                            <th>Nội dung</th>
                            <th>Phản hồi</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map(fb => (
                            <tr key={fb.id}>
                                <td>{fb.Resident?.name}</td>
                                <td>{fb.Resident?.email}</td>
                                <td>{fb.Resident?.phoneNumber}</td>
                                <td>{fb.Apartment?.address_number}</td>
                                <td>{fb.reportType}</td>
                                <td>{fb.description}</td>
                                <td>{fb.response || '...'}</td>
                                <td>
                                    <span className={`badge ${fb.status.toLowerCase().replace(/\s/g, '-')}`}>
                                        {fb.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FeedbackPage;
