const {check} = require('express-validator');

exports.LoginValidation = [
    check('id', 'Please enter a valid id').notEmpty().isInt({min:1}),
    check('password', "Password is required").isLength({min: 6})
]
