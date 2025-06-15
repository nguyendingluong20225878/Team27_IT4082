const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access token is missing' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ 
            success: false,
            message: 'Invalid token' 
        });
    }
};

const verifyTokenAdmin = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access token is missing' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }

        if (decoded.role !== 'admin') {
            return res.status(403).json({ 
                success: false,
                message: 'You are not authorized to access this resource' 
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Admin token verification error:', error);
        return res.status(401).json({ 
            success: false,
            message: 'Invalid token' 
        });
    }
};

const verifyTokenAccountant = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access token is missing' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }

        if (decoded.role !== 'accountant') {
            return res.status(403).json({ 
                success: false,
                message: 'You are not authorized to access this resource' 
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Accountant token verification error:', error);
        return res.status(401).json({ 
            success: false,
            message: 'Invalid token' 
        });
    }
};

module.exports = {
    verifyToken,
    verifyTokenAdmin,
    verifyTokenAccountant
}; 