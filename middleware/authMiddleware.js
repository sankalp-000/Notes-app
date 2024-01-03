const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }

    jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
        // console.log(token);
        // console.log(process.env.JWT_SECRET);
        // console.log(err);
        if (err) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        req.userId = decoded.userId;
        next();
    });
};

module.exports = { verifyToken };
