const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('X-auth-token');

    //Check if no token 
    if (!token) {
        return res.status(401).json({ mes: 'no token,auth denied' });
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtToken'));
        req.user = decoded.user;
        next();

    } catch (err) {
        res.status(401).json({ mes: 'Token is not valid' });
    }

}