//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addTeacherFunction = async (teacherData) => {
    try {
        const { teacherId, teacherName, departmentId, designation, joiningDate, password, userId} = teacherData;

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO TEACHER (
            TEACHER_ID, 
            TEACHER_NAME,
            DEPT_ID,
            DESIGNATION,
            JOINING_DATE
            ) VALUES (?,?,?,?,?)
        `;

        const query2 = `
            INSERT INTO USERS (
            USER_ID, PASSWORD, ROLE
            ) VALUES (?,?,?)
        `;

        const binds = { userId };

        const values = [
            teacherId, teacherName, departmentId, designation, joiningDate
        ];

        const values2 = [
            teacherId, hashedPassword, 'teacher'
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

        console.log("Teacher added successfully");

        console.log(teacherId);
        return { success: true, message: 'Teacher added successfully', teacherId};
    } catch (error) {
        console.error('Error during teacher addition:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { addTeacherFunction };