const express = require('express');
const router = express.Router();

// local imports
const User = require('../models');
const auth = require('../auth')
const mid = require('../middleware');

router.get('/', (req, res, next) => {
    return res.json({
        message: 'This is home'
    })
});

router.get('/register', mid.verifyTokenMiddleware, (req, res, next) => {
    return res.json({
        message: 'post here'
    });
});

router.post('/register', (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
    } = req.body;
    if (firstName && lastName && email && password) {
        // check if email already exists
        User.findOne({
            email
        }, (err, user) => {
            if (user) {
                return res.status(400).send({
                    message: "Email already Exists!"
                });
            };
        });
        //create user object
        const userData = {
            firstName,
            lastName,
            email,
            password
        }
        // insert document into mongo
        User.create(userData, error => {
            if (error) {
                return next(error);
            }
            return res.status(200).send({
                token: auth.generateAuthToken({
                    userData
                }),
                message: 'success'
            });
        });
    } else {
        const err = new Error('All fields are required!');
        err.status = 400;
        return next(err);
    }
});

router.get('/login', (req, res) => {
    return res.json({
        message: 'Login form'
    })
});

router.post('/login', (req, res, next) => {
    const {
        email,
        password,
    } = req.body
    if (email && password) {

        User.authenticate(email, password, (error, user) => {
            if (error || !user) {
                const err = new Error('Wrong Email/Password Combination!')
                err.status = 401;
                return next(err);
            }
            return res.status(200).send({
                token: auth.generateAuthToken(user.toJSON()),
                message: 'success'
            });
        });
    } else {
        const err = new Error("Email/Password must be provided");
        err.status = 401;
        return next(err);
    }
});

module.exports = router;