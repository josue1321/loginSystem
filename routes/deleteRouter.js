const router = require('express').Router()
const loginModel = require('../models/loginModel')
const bcrypt = require('bcrypt')

require('dotenv').config()

router.get('/', (req, res) => {
    res.render('delete', { layout: 'loginLayout', title: 'Delete Account', google_client_id: process.env.GOOGLE_CLIENT_ID, error: req.session.error, msg: req.session.msg })
    if (req.session.error || req.session.msg) {
        delete req.session.error
        delete req.session.msg
    }
})

router.post('/', async (req, res) => {
    const email = req.session.auth
    const password = await (async () => {
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
            return payload.sub
        }

        return req.body.password
    })()

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