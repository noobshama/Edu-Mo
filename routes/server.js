require("dotenv").config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('../config/dbConnection');

const userRouter = require('../routes/userRoute');
const { registerTeacher } = require('../database/teacher/addTeacher');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use('/api', userRouter);

// error handling
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/register', function (req, res) {
    res.render('register'); // Assuming 'register.ejs' is in your views directory
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/contact', function (req, res) {
    res.render('contact');
});

app.post('/register', async (req, res) => {
    const result = await registerTeacher(req.body);
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(500).json(result);
    }
});

app.use('/home', require('../routes/authorization'));

app.listen(7000, () => console.log('Server is running on port 7000'));
