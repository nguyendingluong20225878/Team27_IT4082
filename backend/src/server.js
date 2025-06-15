const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const app = express();
const sequelize = require('./database');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Debugging: Log JWT_SECRET after dotenv config
console.log('Loaded JWT_SECRET from .env:', process.env.JWT_SECRET);

// const ReportUser = require('./models/ReportUser');
const FeedbackUser = require('./models/FeedbackUser');
const Utility_bill = require('./models/utility_bill');
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

// // Hàm chỉ drop và tạo lại bảng FeedbackUser
// async function syncFeedbackUserTableOnly() {
//   try {
//     await FeedbackUser.sync({ force: true });
//     console.log('FeedbackUser table synced (dropped and recreated) successfully.');
//   } catch (err) {
//     console.error('Error syncing FeedbackUser table:', err);
//   }
// }

// // Gọi hàm này khi cần drop và tạo lại bảng FeedbackUser
// syncFeedbackUserTableOnly();

sequelize.sync({force: false}) // Set force: true to drop and recreate the database
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        }); 
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
});
