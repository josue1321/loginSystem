const router = require('express').Router()
const loginModel = require('../models/loginModel')
const bcrypt = require('bcrypt')
const userData = require('../src/userData')

require('dotenv').config()

router.get('/', (req, res) => {
    if (req.session.auth) { return res.redirect('/') }
    res.render('login', { layout: 'loginLayout', title: 'Login', google_client_id: process.env.GOOGLE_CLIENT_ID, error: req.session.error, msg: req.session.msg })
    if (req.session.error || req.session.msg) {
        delete req.session.error
        delete req.session.msg
    }
})

router.post('/', async (req, res) => {
    try {
        const { email, password } = await userData(req)

        const user = await loginModel.findOne({ email })

        if (user) {
            const compareResponse = await bcrypt.compare(password, user.password)

            if (compareResponse) {
                req.session.auth = email
                return res.redirect('/')
            }
        }

        req.session.error = true
        req.session.msg = 'Email address or password is invalid'
        setTimeout(() => res.redirect('/login'), 50)
    } catch (err) {
        req.session.error = true
        req.session.msg = 'A error occur, Please try again'
        console.error(err)
        res.redirect('/login')
    }
})

module.exports = router