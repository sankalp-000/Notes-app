const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const throttle = require('express-throttle');
const authRoutes = require('./routes/authRoute');
const noteRoutes = require('./routes/noteRoute');

dotenv.config();

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute per IP
});

app.use(limiter);

const throttleSettings = {
    burst: 30, // 30 requests in a burst
    rate: process.env.THROTTLE_RATE || '15/min', // 15 requests per minute per IP
    ip: true,
};

// Use throttle middleware
app.use(throttle(throttleSettings));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
