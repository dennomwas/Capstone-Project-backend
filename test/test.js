let mongoose = require('mongoose');
let User = require('../models');
let server = require('../app');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect

chai.use(chaiHttp);

describe('Capstone Project', () => {
    beforeEach(done => {
        User.remove({}, err => {
            console.log('DB Removed');
            done();
        });
    });
});

describe('Login', () => {
    it('Should get the user login route', (done) => {
        chai.request(server)
            .get('/login')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('Should login a user', (done) => {
        let newUser = {
            email: 'mwas@andela.com',
            password: '123456',
        }
        chai.request(server)
            .post('/login')
            .send(newUser)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.message.should.be.a('string', 'success');
                done();
            })
    });

    it('Should not login an null user', (done) => {
        let newUser = {
            email: '',
            password: '',
        }
        chai.request(server)
            .post('/login')
            .send(newUser)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.error.message.should.be.a('string', 'Email/Password must be provided');
                done();
            })
    });
});

describe('Register', () => {
    it('Should not register a user without all details', (done) => {
        let newUser = {
            firstName: 'Dennis',
            lastName: 'Mwangi',
        }
        chai.request(server)
            .post('/register')
            .send(newUser)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.error.message.should.be.a('string', 'All fields are required!');
                done();
            })
    });
    it('Should successfully register a user', (done) => {
        let newUser = {
            firstName: 'Dennis',
            lastName: 'Mwangi',
            email: 'dennis098574@gmail.com',
            password: '123456'
        }
        chai.request(server)
            .post('/register', async)
            .send(newUser)
            .end((err, res) => {
                console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object', newUser);
                res.body.message.should.be.a('string', 'success')
                done();
            })
    });
    it('Should not successfully register a user with a duplicate email', (done) => {
        let user1 = {
            firstName: 'Dennis',
            lastName: 'Mwangi',
            email: 'mwas@andela.com',
            password: '123456'
        }
        let user2 = {
            firstName: 'Dennis',
            lastName: 'Mwangi',
            email: 'mwas@andela.com',
            password: '123456'
        }
        chai.request(server)
            .post('/register')
            .send(user1, user2)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be.a('string', 'Email already Exists!');
                done();
            })
    });

});