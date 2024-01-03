const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signup, login } = require('../controllers/authController');
const User = require('../models/User');


jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/user');

const req = {
    body: {
        username: 'testUser',
        password: 'testPassword',
    },
};

const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
};


describe('Auth Controller signup method test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new user successfully', async () => {
        User.findOne.mockResolvedValueOnce(null);

        bcrypt.hash.mockResolvedValueOnce('hashedPassword');

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    it('should handle existing username during registration', async () => {
        User.findOne.mockResolvedValueOnce({ username: 'existingUser' });

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Username already exists' });
    });

    it('should handle errors during registration', async () => {
        User.findOne.mockRejectedValueOnce(new Error('Some database error'));

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});



describe('Auth Controller login test ', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should log in a user successfully', async () => {
        User.findOne.mockResolvedValueOnce({
            username: 'testUser',
            password: 'hashedPassword',
            _id: 'userId',
        });

        bcrypt.compare.mockResolvedValueOnce(true);

        jwt.sign.mockReturnValueOnce('fakeToken');

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: 'fakeToken' });
    });
    it('should handle errors during login', async () => {
        User.findOne.mockRejectedValueOnce(new Error('Some database error'));

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });

    it('should handle invalid credentials during login', async () => {
        User.findOne.mockResolvedValueOnce(null);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });


    it('should handle incorrect password during login', async () => {
        const mockUser = { username: 'testUser', password: 'hashedPassword' };
        User.findOne.mockResolvedValueOnce(mockUser);
        bcrypt.compare.mockResolvedValueOnce(false);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
});