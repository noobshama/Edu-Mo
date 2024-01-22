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
const { addStudentFunction } = require("../database/teacher/addStudent");
const { addCourseFunction } = require("../database/teacher/addCourse");
const { addDepartmentFunction } = require("../database/teacher/addDepartment");
//const { addTeacherFunction } = require("../database/teacher/addTeacher");

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



app.get('/adminSide/addDepartment', (req, res) => {
    const userId = req.query.userId;
    console.log(userId);
    res.render('adminSide/addDepartment', { userId });

});

app.get('/adminSide/addStudent', (req, res) => {
    const userId = req.query.userId;
    res.render('adminSide/addStudent', { userId });
});
app.get('/adminSide/addCourse', (req, res) => {
    const userId = req.query.userId;
    res.render('adminSide/addCourse', { userId });
});

app.post('/adminSide/addStudent', async (req, res) => {
    try {
        console.log('add student');
        const result = await addStudentFunction(req.body);
        console.log(result.studentId);
        if (result.success) {
            console.log('adminSide/adminHome: ', req.body.userId);
            res.redirect(`/adminSide/adminHome?userId=${req.body.userId}`);
            
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
app.post('/adminSide/addCourse', async (req, res) => {
    try {
        console.log('add course');
        const result = await addCourseFunction(req.body);
        console.log(result.courseId);
        if (result.success) {
            console.log('adminSide/adminHome: ', req.body.userId);
            res.redirect(`/adminSide/adminHome?userId=${req.body.userId}`);
            
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
app.post('/adminSide/addDepartment', async (req, res) => {
    try {
        console.log('add department');
        const result = await addDepartmentFunction(req.body);
        console.log(result.deptId);
        if (result.success) {
            console.log('adminSide/adminHome: ', req.body.userId);
            res.redirect(`/adminSide/adminHome?userId=${req.body.userId}`);
            
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

// app.get('/adminSide/addTeacher', (req, res) => {
//     const userId = req.query.userId;
//     res.render('adminSide/addTeacher', { userId });
// });

app.use('/home', require('../routes/authorization'));

app.listen(7000, (error) => {
    if (error) {
        console.error('Error starting the server:', error);
    } else {
        console.log('Server is running on port 7000');
    }
});