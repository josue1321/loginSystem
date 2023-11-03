const router = require('express').Router()
const loginModel = require('../models/loginModel')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    res.render('login', { layout: 'loginLayout', title: 'Login', error: req.session.error, msg: req.session.msg })
    if (req.session.error || req.session.msg) {
        delete req.session.error
        delete req.session.msg
    }
})

router.post('/', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await loginModel.findOne({ email })

        if (user) {
            const compareResponse = await bcrypt.compare(password, user.password)

            if (compareResponse) {
                req.session.auth = email
                res.redirect('/')
            } else {
                req.session.error = true
                req.session.msg = 'Email address or password is invalid'
                res.redirect('/login')
            }
        } else {
            req.session.error = true
            req.session.msg = 'Email address or password is invalid'
            res.redirect('/login')
        }
    } catch (err) {
        req.session.error = true
        req.session.msg = 'A error occur, Please try again'
        console.log(err)
    }
})

module.exports = router