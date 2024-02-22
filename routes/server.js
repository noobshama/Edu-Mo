require("dotenv").config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('../config/dbConnection');

const userRouter = require('../routes/userRoute');
const { registerAdmin } = require('../database/teacher/addAdmin');
//const { getInfo } = require('../database/teacher/getAdminInfo');
const query = require("../database/teacher/getAdminInfo");
const {getTeacherInfo} = require("../database/teacher/getAdminInfo");
const { getStudentInfo } = require('../database/student/getInfo');
const {getInfo} = require("../database/teacher/getTeacherInfo");
const {getDepartmentInfo} = require("../database/teacher/getAllDeptInfo");
const {getCourseInfo} = require("../database/teacher/getAllCourseInfo");
const {getSInfo} = require("../database/teacher/getAllStudentInfo");
const {getTInfo} = require("../database/teacher/getAllTeacherInfo");
const { logInInfo } = require("../database/userLogInInfo");
const { addStudentFunction } = require("../database/teacher/addStudent");
const { addCourseFunction } = require("../database/teacher/addCourse");
const { addDepartmentFunction } = require("../database/teacher/addDepartment");
const { addTeacherFunction } = require("../database/teacher/addTeacher");
const { addHallFunction } = require("../database/teacher/addHall");
const { getDeptNameInfo } = require("../database/teacher/getDeptNameInfo");
const { getHallNameInfo } = require("../database/teacher/getHallNameInfo");
const { getTeacherNameInfo } = require("../database/teacher/getTeacherNameInfo");
const { getCourseTitleInfo } = require("../database/teacher/getCourseTitleInfo");
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
        console.log('server page',result.userId, ' ', result.role);
        if (result.success) {
            if(result.role === 'student') {
                res.redirect(`/studentSide/studentHome?userId=${result.userId}`);
            }
            else if(result.role === 'teacher') {
                res.redirect(`/teacherSide/teacherHome?userId=${result.userId}`);
            }
            else if (result.role === 'admin'){
                res.redirect(`/adminSide/adminHome?userId=${result.userId}`);
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

app.get('/studentSide/studentHome', (req, res) => {
    const userId = req.query.userId;
    console.log('user Id at student home page: ', userId);
    res.render('studentSide/studentHome', { userId });
});
app.get('/studentSide/personalInfo', async (req, res) => {
    try {
        console.log('qqqqqqqqqqq');
        const userId = req.query.userId;
        const userInfo=await getStudentInfo(userId);
        console.log(userInfo);
        res.render("studentSide/personalInfo",{userInfo: userInfo.studentInfo, userId: userId});
    } catch (error) {
        console.error('Error during /studentSide/personalInfo:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
app.get('/teacherSide/teacherHome', (req, res) => {
    const userId = req.query.userId;
    console.log('user Id at teacher home page: ', userId);
    res.render('teacherSide/teacherHome', { userId });
});
app.get('/teacherSide/personalInfo', async (req, res) => {
    try {
        console.log('qqqqqqqqqqq');
        const userId = req.query.userId;
        const userInfo=await getInfo(userId);
        console.log(userInfo);
        res.render("teacherSide/personalInfo",{userInfo: userInfo.teacherInfo, userId: userId});
    } catch (error) {
        console.error('Error during /teacherSide/personalInfo:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/adminSide/personalInfo', async (req, res) => {
    try {
        const userId = req.query.userId;
        const userInfo=await getTeacherInfo(userId);
        res.render("adminSide/personalInfo",{userInfo: userInfo.adminInfo, userId: userId});
    } catch (error) {
        console.error('Error during /adminSide/personalInfo:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
app.get('/adminSide/showDepartment', async (req, res) => {
    try {
        const userId = req.query.userId;
        const departmentData = await getDepartmentInfo();
        console.log(typeof departmentData, departmentData);

        // Check if departmentData contains the deptInfo array
        if (departmentData && departmentData.deptInfo) {
            res.render("adminSide/showDepartment", { AllDeptInfo: departmentData.deptInfo, userId: userId });
        } else {
            // Handle the case where departmentData.deptInfo is not available
            res.status(404).send("Department information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/showDepartment:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
app.get('/adminSide/addCourseOri', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const deptName = req.query.deptName;
        const courseTitleData = await getCourseTitleInfo(deptName);
        if (courseTitleData) {
            res.render("adminSide/addCourseOri", { AllCourseTitleInfo: courseTitleData.courseTitleInfo, userId: userId, deptName: deptName });
        } else {
            res.status(404).send("course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/addCourseOri:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.post('/adminSide/addCourseOri', async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log('add course');
        const result = await addCourseFunction(req.body);
        console.log(result.courseCode);
        if (result.success) {
            console.log('adminSide/adminHome: ', req.body.userId);
            res.redirect(`/adminSide/adminHome?userId=${req.body.userId}`);

        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error during add course:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
app.get('/adminSide/addCourse', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const deptNameData = await getDeptNameInfo();
        console.log(typeof deptNameData, deptNameData);
        if (deptNameData && deptNameData.deptNameInfo) {
            res.render("adminSide/selectDepartment", { AllDeptNameInfo: deptNameData.deptNameInfo, userId: userId });
        } else {
            // Handle the case where departmentData.deptInfo is not available
            res.status(404).send("Department information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/addCourse:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
app.post('/adminSide/selectDepartment',async(req,res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const courseTitleData = await getCourseTitleInfo(req.query.deptName);
        if (courseTitleData) {
            res.render("adminSide/addCourseOri", { AllDeptNameInfo: deptNameData.deptNameInfo,AllCourseTitleInfo: courseTitleData.courseTitleInfo, userId: userId });
        } else {
            res.status(404).send("Department or course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/addCourse:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
     }
});
app.post('/adminSide/addCourse', async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log('add course');
        const result = await addCourseFunction(req.body);
        console.log(result.courseCode);
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
app.get('/adminSide/showCourse', async (req, res) => {
    try {
        const userId = req.query.userId;
        const courseData = await getCourseInfo();
        console.log(typeof courseData, courseData);

        // Check if departmentData contains the deptInfo array
        if (courseData && courseData.courseInfo) {
            res.render("adminSide/showCourse", { AllCourseInfo: courseData.courseInfo, userId: userId });
        } else {
            // Handle the case where departmentData.deptInfo is not available
            res.status(404).send("course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/showCourse:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
app.get('/adminSide/showStudentInfo', async (req, res) => {
    try {
        const userId = req.query.userId;
        const studentData = await getSInfo();
        console.log(typeof studentData, studentData);

        // Check if departmentData contains the deptInfo array
        if (studentData && studentData.studentInfo) {
            res.render("adminSide/showStudentInfo", { AllStudentInfo: studentData.studentInfo, userId: userId });
        } else {
            // Handle the case where departmentData.deptInfo is not available
            res.status(404).send("student information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/showStudentInfo:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});


app.get('/adminSide/showTeacherInfo', async (req, res) => {
    try {
        const userId = req.query.userId;
        const teacherData = await getTInfo();
        console.log(typeof teacherData, teacherData);

        // Check if departmentData contains the deptInfo array
        if (teacherData && teacherData.teacherInfo) {
            res.render("adminSide/showTeacherInfo", { AllTeacherInfo: teacherData.teacherInfo, userId: userId });
        } else {
            // Handle the case where departmentData.deptInfo is not available
            res.status(404).send("teacher information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/showTeacherInfo:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});


app.get('/adminSide/addDepartment', (req, res) => {
    const userId = req.query.userId;
    console.log(userId);
    res.render('adminSide/addDepartment', { userId });

});

app.get('/adminSide/addStudent',async (req, res) => {
    try {
    const userId = req.query.userId;
    const deptNameData = await getDeptNameInfo();
    const teacherNameData = await getTeacherNameInfo();
    const hallNameData =await getHallNameInfo();
    console.log(typeof deptNameData, deptNameData);
    console.log(typeof teacherNameData, teacherNameData);
    console.log(typeof hallNameData, hallNameData);
    if (deptNameData && deptNameData.deptNameInfo && teacherNameData && teacherNameData.teacherNameInfo && hallNameData && hallNameData.hallNameInfo) {
        res.render("adminSide/addStudent", { AllDeptNameInfo: deptNameData.deptNameInfo,AllTeacherNameInfo:teacherNameData.teacherNameInfo,AllHallNameInfo:hallNameData.hallNameInfo, userId: userId });
    } else {
        // Handle the case where departmentData.deptInfo is not available
        res.status(404).send("student information not available");
    }
} catch (error) {
    console.error('Error during /adminSide/addStudent:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
}
});



app.get('/adminSide/addTeacher', async(req, res) => {
    try {
        const userId = req.query.userId;
        const deptNameData = await getDeptNameInfo();
        
        console.log(typeof deptNameData, deptNameData);

        // Check if departmentData contains the deptInfo array
        if (deptNameData && deptNameData.deptNameInfo) {
            res.render("adminSide/addTeacher", { AllDeptNameInfo: deptNameData.deptNameInfo, userId: userId });
        } else {
            // Handle the case where departmentData.deptInfo is not available
            res.status(404).send("Department information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/addTeacher:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
    // const userId = req.query.userId;
    // console.log(userId);
    // res.render('adminSide/addTeacher', { userId });
});
app.get('/adminSide/addHall', async(req, res) => {
    try {
        const userId = req.query.userId;
        const teacherNameData = await getTeacherNameInfo();
        console.log(typeof teacherNameData, teacherNameData);

        // Check if departmentData contains the deptInfo array
        if (teacherNameData && teacherNameData.teacherNameInfo) {
            res.render("adminSide/addHall", { AllTeacherNameInfo: teacherNameData.teacherNameInfo, userId: userId });
        } else {
            // Handle the case where departmentData.deptInfo is not available
            res.status(404).send("Teacher information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/addHall:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
    // const userId = req.query.userId;
    // console.log(userId);
    // res.render('adminSide/addTeacher', { userId });
});
app.post('/adminSide/addHall', async (req, res) => {
    try {
        console.log('add Hall');
        console.log('Received form data:', req.body);
        const result = await addHallFunction(req.body);
        console.log(result.hallId);
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
app.post('/adminSide/addStudent', async (req, res) => {
    try {
        console.log('add student');
        console.log('Received form data:', req.body);
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
app.post('/adminSide/addTeacher', async (req, res) => {
    try {
        console.log('add teacher');
        console.log('Received form data:', req.body);
        const result = await addTeacherFunction(req.body);
        console.log(result.teacherId);
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
app.get('/adminSide/offerCourse', (req, res) => {
    const userId = req.query.userId;
    console.log('user Id at student home page: ', userId);
    res.render('adminSide/offerCourse', { userId });
});
app.get('/studentSide/enrollment', (req, res) => {
    const userId = req.query.userId;
    console.log('user Id at student home page: ', userId);
    res.render('studentSide/enrollment', { userId });
});
app.get('/studentSide/addCourse', (req, res) => {
    const userId = req.query.userId;
    console.log('user Id at student home page: ', userId);
    res.render('studentSide/addCourse', { userId });
});
app.get('/studentSide/dropCourse', (req, res) => {
    const userId = req.query.userId;
    console.log('user Id at student home page: ', userId);
    res.render('studentSide/dropCourse', { userId });
});
app.get('/studentSide/Approval', (req, res) => {
    const userId = req.query.userId;
    console.log('user Id at student home page: ', userId);
    res.render('studentSide/Approval', { userId });
});
app.get('/studentSide/selectLevelTerm', (req, res) => {
    const userId = req.query.userId;
    console.log('user Id at student home page: ', userId);
    res.render('studentSide/selectLevelTerm', { userId });
});
app.get('/studentSide/result', (req, res) => {
    const userId = req.query.userId;
    console.log('user Id at student home page: ', userId);
    res.render('studentSide/result', { userId });
});

// app.post('/adminSide/offerCourse', async (req, res) => {
//     try {
//         const result = await registerAdmin(req.body);
//         console.log(result.userId);
//         if (result.success) {
//             res.redirect(`/adminSide/adminHome?userId=${result.userId}`);
//         } else {
//             res.status(500).json(result);
//         }
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
//     }
// });

app.use('/home', require('../routes/authorization'));

app.listen(7000, (error) => {
    if (error) {
        console.error('Error starting the server:', error);
    } else {
        console.log('Server is running on port 7000');
    }
});