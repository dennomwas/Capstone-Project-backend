const jwtToken = require('./auth');

const verifyTokenMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token) {
        const authData = jwtToken.verifyAuthToken(token)
        req.user = authData
        return next();
    }
    return res.status(403).send({
        message: 'Forbidden'
    })
}

module.exports.verifyTokenMiddleware = verifyTokenMiddleware;