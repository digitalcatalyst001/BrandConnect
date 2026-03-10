const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendor', require('./routes/vendorRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BrandConnect API 🚀' });
});

// Error handling middleware
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BrandConnect server running on port ${PORT}`);
});
