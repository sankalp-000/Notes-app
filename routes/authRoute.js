const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const noteRoutes = require('./noteRoute');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', verifyToken, logout);


router.use('/notes', noteRoutes);

module.exports = router;
