//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addCourseFunction = async (courseData) => {
    try {
        const { courseId, courseName, creditHour,deptId} = courseData;

      

        const query = `
            INSERT INTO COURSE (
            COURSE_ID, 
            COURSE_NAME,
            CREDIT_HOUR,
            DEPARTMENT_ID
            ) VALUES (?,?,?,?)
        `;

       

       // const binds = { userId };

        const values = [
            courseId, courseName, creditHour,deptId
        ];

       

        console.log("Query 1:", query, "Values 1:", values);
        
        await pool.query(query, values, (error, results) => {
            if (error) {
                console.error('Error executing query 1:', error);
            } else {
                console.log('Query 1 executed successfully');
            }
        });

       
        console.log("course added successfully");

        console.log(courseId);
        return { success: true, message: 'Course added successfully', courseId};
    } catch (error) {
        console.error('Error during student addition:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { addCourseFunction };