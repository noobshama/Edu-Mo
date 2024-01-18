const express =require('express');

const router =express.Router();

const path = require('path');
//const multer = require('multer');

const { LoginValidation} =require('../helpers/validation');

const userController =require('../controllers/userController');


router.post('/login',LoginValidation,userController.login);

module.exports = router;