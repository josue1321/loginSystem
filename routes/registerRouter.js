const router = require('express').Router()
const loginModel = require('../models/loginModel')
const bcrypt = require('bcrypt');
const userData = require('../src/userData');

require('dotenv').config()

router.get('/', (req, res) => {
    if (req.session.auth) { return res.redirect('/') }
    res.render('register', { layout: 'loginLayout', title: 'Register', google_client_id: process.env.GOOGLE_CLIENT_ID, error: req.session.error, msg: req.session.msg })
    if (req.session.error || req.session.msg) {
        delete req.session.error
        delete req.session.msg
    }
})

router.post('/', async (req, res) => {
    try {
        const { email, password } = await userData(req)

        if (await loginModel.findOne({ email })) {
            req.session.error = true
            req.session.msg = 'This email is already registered. Please try a different email or sign in'
            return res.redirect('/register')
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                req.session.error = true
                req.session.msg = 'A error occur, Please try again'
                console.error(err)
                return res.redirect('/register')
            }

            req.session.regenerate(async (err) => {
                if (err) {
                    req.session.error = true
                    req.session.msg = 'A error occur, Please try again'
                    console.error(err)
                    return res.redirect('/register')
                }

                await loginModel.create({
                    email,
                    password: hash
                })
                req.session.auth = email
                res.redirect('/')
            })
        })
    } catch (err) {
        req.session.error = true
        req.session.msg = 'A error occur, Please try again'
        console.error(err)
        res.redirect('/register')
    }
})

module.exports = router