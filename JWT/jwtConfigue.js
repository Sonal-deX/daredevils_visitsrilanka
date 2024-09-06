const jwt = require('jsonwebtoken');

// Secret key for JWT signing
const secretKey = 'visitSrilanka123';

// for admin
exports.createTokenAdmin = (user) => {
    const payLoad = {
        userId: user.dataValues.adminId,
        role: "admin"
    }
    return new Promise((resolve, reject) => {
        jwt.sign(payLoad, secretKey, (err, token) => {
            if (err) {
                reject('Failed to generate token');
            } else {
                resolve(token);
            }
        });
    });
};

// verify token admin
exports.verifyTokenAdmin = (req, res, next) => {
    const { token } = req.headers;
    if (!token) return res.status(401).send('Access denied. No token provided.');
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }

}

// admin only
exports.adminOnly = (req, res, next) => {
    if (req.user.role != "admin") return res.status(403).send('Access denied.');
    next();
};

// token creation
exports.createToken = (user) => {

    return new Promise((resolve, reject) => {
        jwt.sign({ user }, secretKey, (err, token) => {
            if (err) {
                reject('Failed to generate token');
            } else {
                resolve(token);
            }
        });
    });
};

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        next()
    });
};