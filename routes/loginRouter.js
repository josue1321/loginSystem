const router = require('express').Router()
const loginModel = require('../models/loginModel')
const bcrypt = require('bcrypt')

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
        const userData = await (async () => {
            if (req.body.credential) {
                if (!req.cookies.g_csrf_token) {
                    throw new Error('No CSRF token in Cookie')
                }
                if (!req.body.g_csrf_token) {
                    throw new Error('No CSRF token in Post body')
                }
                if (req.cookies.g_csrf_token != req.body.g_csrf_token) {
                    throw new Error('Failed to verify double submit cookie')
                }

                const { OAuth2Client } = require('google-auth-library');
                const client = new OAuth2Client();

                const ticket = await client.verifyIdToken({
                    idToken: req.body.credential,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });

                const payload = ticket.getPayload();
                return { 'email': payload.email, 'password': payload.sub }
            }

            return req.body
        })()

        const { email, password } = userData

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