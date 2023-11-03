const mongoose = require('mongoose')

const loginModel = mongoose.model('user', {
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
    },
    password: {
        type: String,
        required: 'Password is required'
    }
})

module.exports = loginModel