const jwt = require('jsonwebtoken');

const generateAuthToken = data => {
    try {
        const token = jwt.sign(data, 'express-jwt-password', {
            expiresIn: '1h'
        })
        return token
    } catch (err) {
        return err
    }
}

const verifyAuthToken = token => {
    try {
        const decodedData = jwt.verify(token, 'express-jwt-password');
        return decodedData;
    } catch (err) {
        return err;
    }

}

module.exports.generateAuthToken = generateAuthToken;
module.exports.verifyAuthToken = verifyAuthToken;