require("dotenv").config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('../config/dbConnection');

const userRouter = require('../routes/userRoute');
const { registerAdmin } = require('../database/teacher/addAdmin');
const { getTeacherInfo } = require('../database/teacher/getAdminInfo');
//const query = require("../database/teacher/getAdminInfo");
const { logInInfo } = require("../database/userLogInInfo");
const { getStudentInfo } = require('../database/student/getInfo');
const { getInfo } = require("../database/teacher/getTeacherInfo");
const { addStudentFunction } = require("../database/teacher/addStudent");
const { addTeacherFunction } = require("../database/teacher/addTeacher");
const { addCourseFunction } = require("../database/teacher/addCourse");
const { addDepartmentFunction } = require("../database/teacher/addDepartment");
const { getDepartmentInfo } = require("../database/teacher/getAllDeptInfo");
const { getCourseInfo } = require("../database/teacher/getAllCourseInfo");
const { getAllTeacherInfo } = require("../database/teacher/getAllTeacherInfo");
const { getSInfo } = require("../database/teacher/getAllStudentInfo");
const { getDeptNameInfo } = require("../database/teacher/getDeptNameInfo");
const { getCourseTitleInfo } = require("../database/teacher/getCourseTitleInfo");
const { getTInfo } = require("../database/teacher/getAllTeacherInfo");
const { addHallFunction } = require("../database/teacher/addHall");
const { getHallNameInfo } = require("../database/teacher/getHallNameInfo");
const { getTeacherNameInfo } = require("../database/teacher/getTeacherNameInfo");
const { getSemesterInfo } = require("../database/teacher/getSemesterInfo");
const { getOfferCourseList } = require("../database/teacher/getOfferCourseList");
const { addOfferCourseFunction } = require("../database/teacher/addOfferCourse");
const { getProposedCourseInfo } = require("../database/student/getProposedCourseInfo");
const { addEnrollmentFunction } = require("../database/teacher/addEnrollment");
const { getEnrollmentAddCourseInfo } = require("../database/student/getEnrollmentAddCourseInfo");
const { getEnrollmentDropCourseInfo } = require("../database/student/getEnrollmentDropCourseInfo");
const { dropEnrollmentFunction } = require("../database/teacher/dropEnrollment");
const { getPendingCourseInfo } = require("../database/teacher/getPendingCourseInfo");
const { courseApprovalFunction } = require("../database/teacher/courseApprovalFunction");
const { getOfferCourseAssign } = require("../database/teacher/getOfferCourseAssign");
const { teacherAssignFunction } = require("../database/teacher/teacherAssign");
const { getDeptTeacherInfo } = require("../database/teacher/getDeptTeacherInfo");
const { getCourseToAssignByDept } = require("../database/teacher/getCourseToAssignByDept");
const { getEnrollmentApprovalInfo } = require("../database/student/getEnrollmentApprovalInfo");
const { getResultInfo } = require("../database/student/getResultInfo");
const { getMarkToAssignByDept } = require("../database/teacher/getMarktoAssignByDept");
const { teacherMarkAssignFunction } = require("../database/teacher/teacherMarkAssign");
const { addSemesterFunction } = require("../database/teacher/addSemester");
const {getApprovedCourseList}=require("../database/teacher/getApprovalCourseList");
const {getCourseToGrade} = require("../database/teacher/selectCourseToGradeAssign");
const {receivedGradePoint}=require("../database/teacher/receivedGradePoint");
const { getPendingDropCourseInfo } = require("../database/teacher/getPendingDropCourseInfo");
const { courseDropApprovalFunction } = require("../database/teacher/courseDropApprovalFunction");
const { resultPublishFunction } = require("../database/teacher/resultPublishFunction");
const  {getDeptTeacherNameInfo}= require("../database/teacher/getDeptTeacherName");
const {deptHeadAssign}= require("../database/teacher/deptHeadAssign")
const { showDetailsOfDept } = require("../database/teacher/showDetailsOfDept");
const { statistics } = require("../database/teacher/statistics");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use('/api', userRouter);

//error handling
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
    res.render('register');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', async (req, res) => {
    console.log('here');
    try {
        console.log('here');
        const result = await logInInfo(req.body);
        console.log('server page', result.userId, ' ', result.role);
        if (result.success) {
            if (result.role === 'student') {
                res.redirect(`/studentSide/studentHome?userId=${result.userId}`);
            }
            else if (result.role === 'teacher') {
                res.redirect(`/teacherSide/teacherHome?userId=${result.userId}`);
            }
            else if (result.role === 'admin') {
                res.redirect(`/adminSide/adminHome?userId=${result.userId}`);
            }
        } else {
            res.status(500).json({ success: false, message: 'Invalid user ID or password. Please try again.' });
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

// app.get('/adminSide/personalInfo', async (req, res) => {
//     try {
//         const userId = req.query.userId;
//         const userInfo=await getTeacherInfo(userId);
//         res.render("adminSide/personalInfo",{userInfo: userInfo.adminInfo, userId: userId});
//     } catch (error) {
//         console.error('Error during /adminSide/personalInfo:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
//     }
// });

app.get('/adminSide/addCourse', async (req, res) => {
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

    // try {
    //     const userId = req.query.userId;
    //     console.log(userId);
    //     const deptNameData = await getDeptNameInfo();
    //     console.log(req.query.deptName);
    //     const courseTitleData = await getCourseTitleInfo(req.query.deptName);
    //     console.log(typeof deptNameData, deptNameData);
    //     //console.log(typeof courseTitleData, courseTitleData);

    //     // Check if departmentData contains the deptInfo array
    //     if (deptNameData && deptNameData.deptNameInfo && courseTitleData) {
    //         res.render("adminSide/addCourse", { AllDeptNameInfo: deptNameData.deptNameInfo,AllCourseTitleInfo: courseTitleData.courseTitleInfo, userId: userId });
    //     } else {
    //         // Handle the case where departmentData.deptInfo is not available
    //         res.status(404).send("Department or course information not available");
    //     }
    // } catch (error) {
    //     console.error('Error during /adminSide/addCourse:', error);
    //     res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    // }
});

app.post('/adminSide/selectDepartment', async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const courseTitleData = await getCourseTitleInfo(req.query.deptName);
        if (courseTitleData) {
            res.render("adminSide/addCourseOri", { AllDeptNameInfo: deptNameData.deptNameInfo, AllCourseTitleInfo: courseTitleData.courseTitleInfo, userId: userId });
        } else {
            res.status(404).send("Department or course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/addCourse:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/adminSide/addCourseOri', async (req, res) => {
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

app.get('/adminSide/addDepartment', (req, res) => {
    const userId = req.query.userId;
    console.log(userId);
    res.render('adminSide/addDepartment', { userId });

});

app.post('/adminSide/addDepartment', async (req, res) => {
    try {
        console.log('add department');
        const result = await addDepartmentFunction(req.body);
        console.log(result.deptCode);
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

app.get('/adminSide/addStudent', async (req, res) => {
    try {
        const userId = req.query.userId;
        const deptNameData = await getDeptNameInfo();
        const teacherNameData = await getTeacherNameInfo();
        const hallNameData = await getHallNameInfo();
        console.log(typeof deptNameData, deptNameData);
        console.log(typeof teacherNameData, teacherNameData);
        console.log(typeof hallNameData, hallNameData);
        if (deptNameData && deptNameData.deptNameInfo && teacherNameData && teacherNameData.teacherNameInfo && hallNameData && hallNameData.hallNameInfo) {
            res.render("adminSide/addStudent", { AllDeptNameInfo: deptNameData.deptNameInfo, AllTeacherNameInfo: teacherNameData.teacherNameInfo, AllHallNameInfo: hallNameData.hallNameInfo, userId: userId });
        } else {
            // Handle the case where departmentData.deptInfo is not available
            res.status(404).send("student information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/addStudent:', error);
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

app.get('/adminSide/addHall', async (req, res) => {
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

app.get('/adminSide/addTeacher', async (req, res) => {
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

app.get('/adminSide/addSemester', (req, res) => {
    const userId = req.query.userId;
    console.log(userId);
    res.render('adminSide/addSemester', { userId });

});
app.post('/adminSide/addSemester', async (req, res) => {
    try {
        console.log('add semester');
        const result = await addSemesterFunction(req.body);
        console.log(result.semesterName);
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

app.get('/adminSide/offerCourse', async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const deptNameData = await getDeptNameInfo();
        console.log(typeof deptNameData, deptNameData);
        const semesterData = await getSemesterInfo();
        console.log(typeof semesterData, semesterData);
        if (deptNameData && deptNameData.deptNameInfo) {
            res.render("adminSide/offerCourse", { AllDeptNameInfo: deptNameData.deptNameInfo, AllSemInfo: semesterData.semesterInfo, userId: userId });
        } else {
            // Handle the case where departmentData.deptInfo is not available
            res.status(404).send("Department information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/offerCourse:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/adminSide/offerCourseSend', async (req, res) => {
    try {
        const userId = req.query.userId;
        const semester = req.query.semester;
        const department = req.query.department;
        const level = req.query.level;
        const term = req.query.term;
        console.log(userId);
        const data = {
            userId: userId,
            semester: semester,
            department: department,
            level: level,
            term: term
        };
        console.log(data);
        const result = await getOfferCourseList(data);
        console.log(result);
        if (result) {
            res.render("adminSide/offerCourseSend", { AllCourseTitleInfo: result.results, userId: userId, semester: semester, deptName: department });
        } else {
            res.status(404).send("course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/offerCourseSend:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.post('/adminSide/offerCourseSend', async (req, res) => {
    try {
        //console.log('add teacher');
        console.log('Received form data:', req.body);
        const result = await addOfferCourseFunction(req.body);
        //console.log(result.teacherId);
        if (result.success) {
            console.log('adminSide/adminHome: ', req.body.userId);
            res.redirect(`/adminSide/adminHome?userId=${req.body.userId}`);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error adding offer course:', error);
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

app.get('/adminSide/showCourses', async (req, res) => {
    try {
        const userId = req.query.userId;
        const courseData = await getCourseInfo();
        console.log(typeof courseData, courseData);

        // Check if departmentData contains the deptInfo array
        if (courseData && courseData.courseInfo) {
            res.render("adminSide/showCourses", { AllCourseInfo: courseData.courseInfo, userId: userId });
        } else {
            // Handle the case where departmentData.deptInfo is not available
            res.status(404).send("Course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/showCourses:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/adminSide/showStudentInfo', async (req, res) => {
    try {
        const userId = req.query.userId;
        const studentData = await getSInfo();
        console.log(typeof studentData, studentData);

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

app.get('/adminSide/addCourseAssign', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const deptNameData = await getDeptNameInfo();
        console.log(typeof deptNameData, deptNameData);
        if (deptNameData && deptNameData.deptNameInfo) {
            res.render("adminSide/selectCourseAssignDept", { AllDeptNameInfo: deptNameData.deptNameInfo, userId: userId });
        } else {
            res.status(404).send("Department information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/addCourseAssign:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/adminSide/selectCourseByDept',async(req,res) => {
    try {
        const userId = req.query.userId;
        const deptName = req.query.deptName;
        const offerCourseList = await getCourseToAssignByDept(req.query.deptName);
        if (offerCourseList) {
            res.render("adminSide/selectCourseByDept", { deptName: deptName, data: offerCourseList.results, userId: userId });
        } else {
            res.status(404).send("Department or course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/addCourseAssign:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
     }
});

app.post('/adminSide/selectCourseByDept',async(req,res) => {
    try {
        const userId = req.body.userId;
        const deptName = req.body.deptName;
        const courseTitle = req.body.courseTitle;
        const data = {
            userId: userId,
            deptName: deptName,
            courseTitle: courseTitle
        };
        const teacherData = await getDeptTeacherInfo(data);
        if (teacherData) {
            res.render("adminSide/courseAssign", { deptName: deptName, courseTitle: courseTitle, data: teacherData.results, userId: userId });
        } else {
            res.status(404).send("Department or course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/addCourseAssign:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
     }
});
app.get('/adminSide/courseAssign', async(req, res) => {
    try {
        const userId = req.query.userId;
        const deptName = req.query.deptName;
        const courseTitle = req.query.courseTitle;
        const data = {
            userId: userId,
            deptName: deptName,
            courseTitle: courseTitle
        };
        const offerCourseList = await getOfferCourseAssign(req.query.deptName);
        const teacherData = await getDeptTeacherInfo(data);
        if (offerCourseList ) {
            res.render("adminSide/courseAssign", { deptName: deptName,AllOfferCourse: offerCourseList.results, userId: userId,AllTeacherInfo:teacherData.results });
        } else {
            res.status(404).send("Department or course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/addCourseAssign:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
     }
});

app.post('/adminSide/courseAssign', async (req, res) => {
    try {
        //console.log('add teacher');
        console.log('Received form data:', req.body);
        const result = await teacherAssignFunction(req.body);
        console.log(result);
        if (result.success) {
            console.log('adminSide/adminHome: ', req.body.userId);
            res.redirect(`/adminSide/adminHome?userId=${req.body.userId}`);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error adding offer course:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/adminSide/resultPublish', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const deptNameData = await getDeptNameInfo();
        console.log(typeof deptNameData, deptNameData);
        if (deptNameData && deptNameData.deptNameInfo) {
            res.render("adminSide/selectMarkAssignDept", { AllDeptNameInfo: deptNameData.deptNameInfo, userId: userId });
        } else {
            res.status(404).send("Department information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/resultPublish:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
app.get('/adminSide/selectMarkByDept',async(req,res) => {
    try {
        const userId = req.query.userId;
        const deptName = req.query.deptName;
        const offerCourseList = await getMarkToAssignByDept(req.query.deptName);
        console.log(offerCourseList);
        if (offerCourseList) {
            res.render("adminSide/selectMarkByDept", { deptName: deptName, data: offerCourseList.results, userId: userId });
        } else {
            res.status(404).send("Department or course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/resultPublish:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
     }
});

app.post('/adminSide/selectMarkByDept',async(req,res) => {
    try {
        const userId = req.body.userId;
        const deptName = req.body.deptName;
        const courseTitle = req.body.courseTitle;
        const data = {
            userId: userId,
            deptName: deptName,
            courseTitle:courseTitle
        };
        const teacherData = await getDeptTeacherInfo(data);
        console.log(teacherData);
        console.log(data);
        if (teacherData) {
            res.render("adminSide/MarkAssign", { deptName: deptName, courseTitle: courseTitle, data: teacherData.results, userId: userId });
        } else {
            res.status(404).send("Department or course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/resultPublish:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
     }
});

app.get('/adminSide/markAssign', async(req, res) => {
    try {
        const userId = req.query.userId;
        const deptName = req.query.deptName;
        const courseTitle = req.query. courseTitle;
        const data = {
            userId: userId,
            deptName: deptName,
            courseTitle:courseTitle
        };
        const offerCourseList = await getOfferCourseAssign(req.query.deptName);
        const teacherData = await getDeptTeacherInfo(data);
        if (offerCourseList ) {
            res.render("adminSide/markAssign", { deptName: deptName,AllOfferCourse: offerCourseList.results, userId: userId,AllTeacherInfo:teacherData.results });
        } else {
            res.status(404).send("Department or course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/resultPublish:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
     }
});
app.post('/adminSide/markAssign', async (req, res) => {
    try {
        //console.log('add teacher');
        console.log('Received form data:', req.body);
        const result = await teacherMarkAssignFunction(req.body);
        console.log(result);
        if (result.success) {
            console.log('adminSide/adminHome: ', req.body.userId);
            res.redirect(`/adminSide/adminHome?userId=${req.body.userId}`);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error adding offer course:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/adminSide/resultPublishOri', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        res.render("adminSide/resultPublish", { userId: userId });
    } catch (error) {
        console.error('Error during /adminSide/resultPublish:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
     }
});
app.post('/adminSide/resultPublish', async (req, res) => {
    try {
        const result = await resultPublishFunction();
        console.log(result);
        if (result.success) {
            console.log('adminSide/adminHome: ', req.body.userId);
            res.redirect(`/adminSide/adminHome?userId=${req.body.userId}`);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error during result publish:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
app.get('/adminSide/selectDeptHeadByDept', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const deptNameData = await getDeptNameInfo();
        console.log(typeof deptNameData, deptNameData);
        if (deptNameData && deptNameData.deptNameInfo) {
            res.render("adminSide/selectDeptHeadByDept", { AllDeptNameInfo: deptNameData.deptNameInfo, userId: userId });
        } else {
            res.status(404).send("Department information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/selectDeptHeadByDept:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/adminSide/deptHeadAssign',async(req,res) => {
    try {
        const userId = req.query.userId;
        const deptName = req.query.deptName;
        const data =
        {
            userId: userId,
            deptName: deptName
        }
        //const offerCourseList = await getCourseToAssignByDept(req.query.deptName);
        const deptTeacherNameInfo=await getDeptTeacherNameInfo(data);
        if (deptTeacherNameInfo) {
            res.render("adminSide/deptHeadAssign", { deptName: deptName, data:deptTeacherNameInfo.results, userId: userId });
        } else {
            res.status(404).send("Department or course information not available");
        }
    } catch (error) {
        console.error('Error during /adminSide/deptHeadAssign:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
     }
});
app.post('/adminSide/deptHeadAssign', async (req, res) => {
    try {
        //console.log('add teacher');
        console.log('Received form data:', req.body);
        const result = await deptHeadAssign(req.body);
        console.log(result);
        if (result.success) {
            console.log('adminSide/adminHome: ', req.body.userId);
            res.redirect(`/adminSide/adminHome?userId=${req.body.userId}`);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error adding offer course:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/adminSide/showDetails', async(req, res) => {
    try {
        const userId = req.query.userId;
        const deptName = req.query.deptName;
        console.log(userId);
        console.log(deptName);
        const result = await showDetailsOfDept(deptName);
        console.log(result.results[0]);
        res.render("adminSide/showDetails", { data: result.results[0], userId: userId });
    } catch (error) {
        console.error('Error during /adminSide/showDetails:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
     }
});
app.get('/adminSide/statistics', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const result = await statistics();
        console.log(result);
        res.render("adminSide/statistics", { data: result.results, data2: result.results2, data3: result.results3, data4: result.results4, userId: userId });
    } catch (error) {
        console.error('Error during /adminSide/showDetails:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
     }
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
        const userInfo = await getStudentInfo(userId);
        console.log(userInfo);
        res.render("studentSide/personalInfo", { userInfo: userInfo.studentInfo, userId: userId });
    } catch (error) {
        console.error('Error during /studentSide/personalInfo:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/studentSide/enrollment', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log('user Id at student enrollment page: ', userId);
        const proposedCourseData = await getProposedCourseInfo(userId);
        console.log(proposedCourseData);
        res.render("studentSide/enrollment", { data: proposedCourseData.results, userId: userId });
    } catch (error) {
        console.error('Error during /studentSide/enrollment:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.post('/studentSide/enrollment', async (req, res) => {
    try {
        console.log('Received form data:', req.body);
        const result = await addEnrollmentFunction(req.body);
        if (result.success) {
            console.log('studentSide/studentHome: ', req.body.userId);
            res.redirect(`/studentSide/studentHome?userId=${req.body.userId}`);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error adding offer course:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/studentSide/addCourse', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log('user Id at student enrollment page: ', userId);
        const data = await getEnrollmentAddCourseInfo(userId);
        console.log(data);
        res.render("studentSide/addCourse", { data: data.results, userId: userId });
    } catch (error) {
        console.error('Error during /studentSide/addCourse:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.post('/studentSide/addCourse', async (req, res) => {
    try {
        console.log('Received form data:', req.body);
        const result = await addEnrollmentFunction(req.body);
        if (result.success) {
            console.log('studentSide/studentHome: ', req.body.userId);
            res.redirect(`/studentSide/studentHome?userId=${req.body.userId}`);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error adding offer course:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/studentSide/dropCourse', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log('user Id at student drop course page: ', userId);
        const data = await getEnrollmentDropCourseInfo(userId);
        res.render("studentSide/dropCourse", { data: data.results, userId: userId });
    } catch (error) {
        console.error('Error during /studentSide/dropCourse:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.post('/studentSide/dropCourse', async (req, res) => {
    try {
        console.log('Received form data:', req.body);
        const result = await dropEnrollmentFunction(req.body);
        if (result.success) {
            console.log('studentSide/studentHome: ', req.body.userId);
            res.redirect(`/studentSide/studentHome?userId=${req.body.userId}`);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error during drop enrollment:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
app.get('/studentSide/Approval', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log('user Id at student drop course page: ', userId);
        const data = await getEnrollmentApprovalInfo(userId);
        res.render("studentSide/Approval", { data: data.results, userId: userId });
    } catch (error) {
        console.error('Error during /studentSide/approval:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/studentSide/selectLevelTerm', async(req, res) => {
    const userId = req.query.userId;
    console.log('user Id at student select level term page: ', userId);
    res.render('studentSide/selectLevelTerm', { userId });
});

app.get('/studentSide/result', async(req, res) => {
    try {
        const userId = req.query.userId;
        const level = req.query.level;
        const term = req.query.term
        console.log('user Id at student result page: ', userId);
        const data = {
            userId: userId,
            level: level,
            term: term
        };
        const result = await getResultInfo(data);
        console.log(result);
        res.render("studentSide/result", { data: result.results, userId: userId });
    } catch (error) {
        console.error('Error during /studentSide/result:', error);
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
        const userInfo = await getInfo(userId);
        console.log(userInfo);
        res.render("teacherSide/personalInfo", { userInfo: userInfo.teacherInfo, userId: userId });
    } catch (error) {
        console.error('Error during /teacherSide/personalInfo:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/teacherSide/courseApproval', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log('user Id at teacher approval page: ', userId);
        const pendingCourseData = await getPendingCourseInfo(userId);
        //console.log(pendingCourseData);
        res.render('teacherSide/courseApproval', { data: pendingCourseData.results, userId: userId });
    } catch (error) {
        console.error('Error during /teacherSide/courseApproval:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.post('/teacherSide/courseApproval',async(req,res) => {
    try {
        console.log('Received form data:', req.body);
        const result = await courseApprovalFunction(req.body);
        if (result.success) {
            console.log('teacherSide/teacherHome: ', req.body.userId);
            res.redirect(`/teacherSide/teacherHome?userId=${req.body.userId}`);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error during course approval:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/teacherSide/selectCourseGradeAssign', async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId );
        
        // Fetch the approved course list for the teacher
        const approvedCourseList = await getApprovedCourseList(userId);

        if (approvedCourseList && approvedCourseList.success) {
            res.render("teacherSide/selectCourseGradeAssign", { approvedCourseList: approvedCourseList.results, userId: userId });
        } else {
            res.status(404).send("Approved course list not available");
        }
    } catch (error) {
        console.error('Error during /teacherSide/selectCourseGradeAssign :', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});
app.post('/teacherSide/selectCourseGradeAssign', async (req, res) => {
    try {
        const userId = req.body.userId;
        const courseTitle = req.body.courseTitle;
        const data = {
            userId: userId,
            courseTitle: courseTitle
        };

        const approvedCourse = await getCourseToGrade( courseTitle);

        if (approvedCourse) {
            res.render("teacherSide/gradeAssign", { courseTitle: courseTitle, data: approvedCourse.results, userId: userId });
            } else {
            res.status(404).send("Department or course information not available");
        }
    } catch (error) {
        console.error('Error during /teacherSide/selectCourseGradeAssign:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
     }
});

app.post('/teacherSide/gradeAssign', async (req, res) => {
    try {
        console.log('Received user grades:', req.body);
          
        const result = await receivedGradePoint(req.body.userGrades);
        if (result.success) {
            console.log('teacherSide/gradeAssign: ', req.body.userId);
            res.redirect(`/teacherSide/teacherHome?userId=${req.body.userId}`);
            console.log('aaaaaaa');
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error adding offer course:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.get('/teacherSide/dropCourseApproval', async(req, res) => {
    try {
        const userId = req.query.userId;
        console.log('user Id at teacher drop approval page: ', userId);
        const pendingDropCourseData = await getPendingDropCourseInfo(userId);
        //console.log(pendingCourseData);
        res.render('teacherSide/dropCourseApproval', { data: pendingDropCourseData.results, userId: userId });
    } catch (error) {
        console.error('Error during /teacherSide/dropCourseApproval:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.post('/teacherSide/dropCourseApproval',async(req,res) => {
    try {
        console.log('Received form data:', req.body);
        const result = await courseDropApprovalFunction(req.body);
        if (result.success) {
            console.log('teacherSide/teacherHome: ', req.body.userId);
            res.redirect(`/teacherSide/teacherHome?userId=${req.body.userId}`);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error during course drop approval:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});





app.get('/teacherSide/levelWiseCourseApproval', (req, res) => {
    const userId = req.query.userId;
    console.log('user Id at student home page: ', userId);
    res.render('teacherSide/levelWiseCourseApproval', { userId });
});
app.get('/teacherSide/studentWiseCourseApproval', (req, res) => {
    const userId = req.query.userId;
    console.log('user Id at student home page: ', userId);
    res.render('teacherSide/studentWiseCourseApproval', { userId });
});







app.use('/home', require('../routes/authorization'));

app.listen(7000, (error) => {
    if (error) {
        console.error('Error starting the server:', error);
    } else {
        console.log('Server is running on port 7000');
    }
});