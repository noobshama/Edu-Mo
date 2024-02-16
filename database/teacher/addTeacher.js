//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addTeacherFunction = async (teacherData) => {
    try {
        console.log("Received teacher data:", teacherData);
        const { teacherId, teacherName, deptName, designation, password, userId} = teacherData;

        const hashedPassword = await bcrypt.hash(password, 10);
        const trimmedDeptName = deptName.trim();

        const deptQuery = `
            SELECT DEPT_ID FROM DEPARTMENT
            WHERE DEPT_NAME = ?
        `;
        const results = await new Promise((resolve, reject) => {
            pool.query(deptQuery,deptName, (error, results) => { // pass query directly, don't call the function
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results.length <= 0) {
            return { success: false, message: 'Department not found' };
        }
        const deptId = results[0].DEPT_ID;
        console.log(deptId);
        const userAddQuery = `
            INSERT INTO USER (
                USER_ID,
                PASSWORD,
                ROLE
            ) VALUES (?,?,?)
        `;
        const values = [
            teacherId, hashedPassword, 'teacher'
        ];
        await pool.query(userAddQuery, values, (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                return { success: false, message: 'can not insert user' };
            } else {
                console.log('Query executed successfully');
            }
        });

        const query = `
            INSERT INTO TEACHER (
            TEACHER_NAME,
            DEPT_ID,
            DESIGNATION
            ) VALUES (?,?,?)
        `;
        const info = await pool.query(query, [teacherName, deptId, designation]);

        const binds = { userId };

        console.log("Teacher added successfully");

        console.log(teacherId);

        return { success: true, message: 'Teacher added successfully', teacherId};
    } catch (error) {
        console.error('Error during teacher addition:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { addTeacherFunction };