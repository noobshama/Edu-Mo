require("dotenv").config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('../config/dbConnection');

const userRouter = require('../routes/userRoute');
const { registerAdmin } = require('../database/teacher/addAdmin');
const { getInfo } = require('../database/teacher/getAdminInfo');
const query = require("../database/teacher/getAdminInfo");
const { logInInfo } = require("../database/userLogInInfo");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.set('views',path.join( __dirname,'..', 'views'));
app.set('view engine', 'ejs');

app.use('/api',userRouter);

//error handling
app.use((err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message:err.message,
    });
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/login', function (req, res) {
    res.render('login'); 
});

app.post('/login', async (req, res) =>{
    console.log('here');
    try {
        console.log('here');
        const result = await logInInfo(req.body);
        console.log('server page',result.username, ' ', result.role);
        if (result.success) {
            if(result.role === 'student') {
                res.redirect(`/studentSide/studentHome?userId=${result.username}`);
            }
            else if(result.role === 'teacher') {
                res.redirect(`/teacherSide/personalInfo?userId=${result.username}`);
            }
            else if (result.role === 'admin'){
                res.redirect(`/adminSide/adminHome?userId=${result.username}`);
            }
            //res.redirect(`/adminSide/adminHome?userId=${result.userId}`);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error during log in:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/contact', function (req, res) {
    res.render('contact'); 
});

app.post('/register', async (req, res) => {
    try {
        const result = await registerAdmin(req.body);
        console.log(result.userId);
        if (result.success) {
            res.redirect(`/adminSide/adminHome?userId=${result.userId}`);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/adminSide/adminHome', (req, res) => {
    const userId = req.query.userId;
    console.log('user Id at admin home page: ', userId);
    res.render('adminSide/adminHome', { userId });
});

app.get('/adminSide/personalInfo', async (req, res) => {
    try {
        const userId = req.query.userId;
        const userInfo=await query.getTeacherInfo(userId);
        res.render("adminSide/personalInfo",{userInfo: userInfo.adminInfo, userId: userId});
    } catch (error) {
        console.error('Error during /adminSide/personalInfo:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/adminSide/addCourse', (req, res) => {
    res.render('adminSide/addCourse');
});

app.get('/adminSide/addDepartment', (req, res) => {
    res.render('adminSide/addDepartment');
});

app.get('/adminSide/addStudent', (req, res) => {
    res.render('adminSide/addStudent');
});

app.use('/home', require('../routes/authorization'));

app.listen(7000, (error) => {
    if (error) {
        console.error('Error starting the server:', error);
    } else {
        console.log('Server is running on port 7000');
    }
});