const router = require('express').Router()
const loginModel = require('../models/loginModel')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    res.render('delete', { layout: 'deleteLayout', title: 'Delete Account', error: req.session.error, msg: req.session.msg })
    if (req.session.error || req.session.msg) {
        delete req.session.error
        delete req.session.msg
    }
})

router.post('/', async (req, res) => {
    const email = req.session.auth
    const password = req.body.password

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