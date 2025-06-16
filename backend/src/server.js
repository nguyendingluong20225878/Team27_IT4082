const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const app = express();
// Đảm bảo bạn import các model từ models/index.js để Sequelize nhận diện tất cả các model
const { sequelize, Vehicle, Apartment, Fee, User, Resident, Invoice, InvoicePayment, InvoiceFee, UtilityBill, ResidentApartment } = require('./models'); // Đã thêm import tất cả các model bạn có
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Debugging: Log JWT_SECRET after dotenv config
console.log('Loaded JWT_SECRET from .env:', process.env.JWT_SECRET);

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/', routes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// *** PHẦN QUAN TRỌNG CẦN THAY ĐỔI VÀ SAU ĐÓ ĐẢM BẢO CHUYỂN LẠI ***
// Đồng bộ database
// TẠM THỜI ĐẶT force: true ĐỂ TẠO LẠI BẢNG VỚI CỘT 'id' BỊ THIẾU
// SAU KHI CHẠY THÀNH CÔNG VÀ KIỂM TRA DB, HÃY ĐỔI LẠI THÀNH force: false HOẶC XÓA DÒNG NÀY ĐI
sequelize.sync({ force: false }) // <--- ĐÃ THAY ĐỔI TỪ false SANG true
  .then(() => {
    console.log('Database synced successfully (Tables dropped and recreated if force: true was set).');
    app.listen(port, () => {
      console.log(`Server is running on pornt ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });