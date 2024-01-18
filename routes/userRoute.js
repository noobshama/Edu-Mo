const express =require('express');

const router =express.Router();

const path = require('path');
//const multer = require('multer');

const { loginValidation} =require('../helpers/validation');

const userController =require('../controllers/userController');


router.post('/login',loginValidation,userController.login);

module.exports = router;