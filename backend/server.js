const express = require('express');
const app = express();
const sequelize = require('./config/dbConfig');
const adminRouter = require('./routers/AdminRouter');
const accountantRouter = require('./routers/AccountantRouter');

// Middleware để parse JSON
app.use(express.json());

// Định tuyến
app.use('/api/admin', adminRouter);
app.use('/api/accountant', accountantRouter);

// Đồng bộ hóa các mô hình với cơ sở dữ liệu
const syncModels = async () => {
  try {
    await sequelize.sync({ force: false }); // force: true sẽ xóa và tạo lại bảng (dùng khi test)
    console.log('Database synced');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

syncModels();

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});