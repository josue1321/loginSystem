const router = require('express').Router()
const loginModel = require('../models/loginModel')
const bcrypt = require('bcrypt')
const userData = require('../src/userData')

require('dotenv').config()

router.get('/', (req, res) => {
    if (!req.session.auth) { return res.redirect('/login') }
    res.render('delete', { layout: 'loginLayout', title: 'Delete Account', google_client_id: process.env.GOOGLE_CLIENT_ID, error: req.session.error, msg: req.session.msg })
    if (req.session.error || req.session.msg) {
        delete req.session.error
        delete req.session.msg
    }
})

router.post('/', async (req, res) => {
    const { email, password } = await userData(req)

    const user = await loginModel.findOne({ email })

    const compareResponse = await bcrypt.compare(password, user.password)

    if (compareResponse) {
        await loginModel.deleteOne({ email })
        return res.redirect('/logout')
    }

    req.session.error = true
    req.session.msg = 'Password is incorrect'
    res.redirect('/delete')
})

module.exports = router