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
        confirmPassword,
    } = req.body;
    if (firstName && lastName && email && password && confirmPassword) {
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
        // // check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).send({
                error: "Passwords Must Match"
            });
        };
        //create user object
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }
        // insert document into mongo
        User.create(userData, error => {
            if (error) {
                return error;
            }
            return res.status(200).send({
                token: auth.generateAuthToken({
                    userData
                }),
                message: 'success'
            })
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

router.post('/login', (req, res) => {
    const {
        email,
        password,
    } = req.body
    const token = req.headers['authorization']
    if (token) {
        return res.redirect(302, '/');
    }
    if (email && password) {
        User.authenticate(email, password, (error, user) => {
            if (error || !user) {
                return res.status(401).status({
                    error,
                    message: 'Wrong Email/Password Combination!'
                });
            }
            return res.status(200).send({
                token: auth.generateAuthToken(user.toJSON()),
                message: 'success'
            });
        });
    }
    return res.status(401).send({
        message: 'Please Enter Email and Password'
    });
});

module.exports = router;