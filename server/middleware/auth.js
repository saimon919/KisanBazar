const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        console.warn(`[AUTH] No token provided for request to ${req.originalUrl}`);
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(`[AUTH] Token verified for user: ${decoded.id} (${decoded.name})`);
        next();
    } catch (err) {
        console.error(`[AUTH] Token verification failed: ${err.message}`);
        res.status(401).json({ error: 'Token is not valid' });
    }
};
