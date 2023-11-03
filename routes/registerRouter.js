const router = require('express').Router()
const loginModel = require('../models/loginModel')
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('register', { layout: 'loginLayout', title: 'Register', error: req.session.error, msg: req.session.msg })
    if (req.session.error || req.session.msg) {
        delete req.session.error
        delete req.session.msg
    }
})

router.post('/', (req, res) => {
    const { email, password } = req.body

    try {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return console.log(err)
            }

            const userData = {
                email,
                password: hash
            }

            req.session.regenerate(async (err) => {
                if (err) {
                    return console.log(err)
                }

                await loginModel.create(userData)
                req.session.auth = email
                res.redirect('/')

            })
        })
    } catch (err) {
        req.session.error = true
        req.session.msg = 'A error occur, Please try again'
        console.log(err)
    }
})

module.exports = router