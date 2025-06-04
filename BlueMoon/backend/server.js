// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const User = require('./models/User');
const HoKhau = require('./models/HoKhau');
const NhanKhau = require('./models/NhanKhau');

// Thêm các models mới
const KhoanThu = require('./models/KhoanThu');
const { DotThuPhi, ChiTietThuPhi, DotThuPhiKhoanThu } = require('./models/DotThuPhi'); // Import từ object

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const hoKhauRoutes = require('./routes/hoKhau');
const nhanKhauRoutes = require('./routes/nhanKhau');
const khoanThuRoutes = require('./routes/khoanThu'); // Thêm dòng này
const dotThuPhiRoutes = require('./routes/dotThuPhi'); // Thêm dòng này


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Test database connection and sync models
db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.error('Error: ' + err));

// Đồng bộ database, đảm bảo các models được import và quan hệ được định nghĩa trước khi sync
db.sync() // Không cần `force: true` nữa, để tránh mất dữ liệu
    .then(async () => {
        console.log('Database synced');
        // Create default users if they don't exist
        const adminToTruongExists = await User.findOne({ where: { username: 'admin_to_truong' } });
        if (!adminToTruongExists) {
            await User.create({ username: 'admin_to_truong', password: 'password123', role: 'Tổ trưởng/Tổ phó' });
            console.log('User admin_to_truong created');
        }

        const adminKeToanExists = await User.findOne({ where: { username: 'admin_ke_toan' } });
        if (!adminKeToanExists) {
            await User.create({ username: 'admin_ke_toan', password: 'password123', role: 'Kế toán' });
            console.log('User admin_ke_toan created');
        }

        // Cập nhật trạng thái Đợt thu phí dựa trên ngày hiện tại
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt về đầu ngày

        await DotThuPhi.update(
            { trangThai: 'Đang diễn ra' },
            { where: { ngayBatDau: { [db.Sequelize.Op.lte]: today }, ngayKetThuc: { [db.Sequelize.Op.gte]: today }, trangThai: { [db.Sequelize.Op.ne]: 'Đang diễn ra' } } }
        );

        await DotThuPhi.update(
            { trangThai: 'Đã kết thúc' },
            { where: { ngayKetThuc: { [db.Sequelize.Op.lt]: today }, trangThai: { [db.Sequelize.Op.ne]: 'Đã kết thúc' } } }
        );

        await DotThuPhi.update(
            { trangThai: 'Sắp tới' },
            { where: { ngayBatDau: { [db.Sequelize.Op.gt]: today }, trangThai: { [db.Sequelize.Op.ne]: 'Sắp tới' } } }
        );

    })
    .catch(err => console.error('Error syncing database: ' + err));

// Define Routes
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ho-khau', hoKhauRoutes);
app.use('/api/nhan-khau', nhanKhauRoutes);
app.use('/api/khoan-thu', khoanThuRoutes); // Thêm dòng này
app.use('/api/dot-thu-phi', dotThuPhiRoutes); // Thêm dòng này


// Start the server
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});