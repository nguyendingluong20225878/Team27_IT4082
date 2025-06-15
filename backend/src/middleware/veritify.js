const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access Token is missing' });
    }

    try {
        console.log('--- verifyToken Debugging ---');
        console.log('Received Token:', token);
        console.log('JWT_SECRET (verifyToken):', process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token (verifyToken):', decoded);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error in verifyToken:', err);
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

const verifyTokenAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access Token is missing' });
    }

    try {
        console.log('--- verifyTokenAdmin Debugging ---');
        console.log('Received Token (Admin):', token);
        console.log('JWT_SECRET (verifyTokenAdmin):', process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token (Admin):', decoded);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to access this resource' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error in verifyTokenAdmin:', err);
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

const verifyTokenKetoan = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access Token is missing' });
    }

    try {
        console.log('--- verifyTokenKetoan Debugging ---');
        console.log('Received Token (Ketoan):', token);
        console.log('JWT_SECRET (verifyTokenKetoan):', process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token (Ketoan):', decoded);
        if (!['ketoan', 'accountant'].includes(decoded.role)) {
            return res.status(403).json({ message: 'You are not authorized to access this resource' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error in verifyTokenKetoan:', err);
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

module.exports = { verifyToken, verifyTokenAdmin, verifyTokenKetoan };