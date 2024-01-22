//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addStudentFunction = async (studentData) => {
    try {
        const { studentId, studentName, hallId, deptId, session, isResident, semester, password, teacherId, userId} = studentData;

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO STUDENT (
            STUDENT_ID, 
            STUDENT_NAME,
            HALL_ID,
            DEPT_ID,
            SESSION,
            IS_RESIDENT,
            SEMESTER,
            TEACHER_ID
            ) VALUES (?,?,?,?,?, IF(? = 'true', 1, 0),?,?)
        `;

        const query2 = `
            INSERT INTO USERS (
            USER_ID, PASSWORD, ROLE
            ) VALUES (?,?,?)
        `;

        const binds = { userId };

        const values = [
            studentId, studentName, hallId, deptId, session, isResident, semester, teacherId
        ];

        const values2 = [
            studentId, hashedPassword, 'student'
        ];

        console.log("Query 1:", query, "Values 1:", values);
        console.log("Query 2:", query2, "Values 2:", values2);

        await pool.query(query, values, (error, results) => {
            if (error) {
                console.error('Error executing query 1:', error);
            } else {
                console.log('Query 1 executed successfully');
            }
        });

        await pool.query(query2, values2, (error, results) => {
            if (error) {
                console.error('Error executing query 2:', error);
            } else {
                console.log('Query 2 executed successfully');
            }
        });

        console.log("Student added successfully");

        console.log(studentId);
        return { success: true, message: 'Student added successfully', studentId};
    } catch (error) {
        console.error('Error during student addition:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { addStudentFunction };