//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const deptHeadAssign = async (data) => {
    try {
        const {  deptName, teachers, userId } = data;
        const deptQuery = `
            SELECT DEPT_ID FROM DEPARTMENT
            WHERE DEPT_NAME =?
        `;
        const results = await new Promise((resolve, reject) => {
            pool.query(deptQuery, deptName, (error, results) => { // pass query directly, don't call the function
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

       ;

        const teacherSerialQuery = `
            SELECT TEACHER_SERIAL_NO FROM TEACHER
            WHERE TEACHER_NAME IN(?)
        `;
        const results3 = await new Promise((resolve, reject) => {
            pool.query(teacherSerialQuery, [teachers], (error, results) => { // pass query directly, don't call the function
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results3.length <= 0) {
            return { success: false, message: 'User not found' };
        }
        console.log(results3);

        const query = `
            INSERT INTO DEPARTMENT_HEAD_ASSIGN(
                DEPT_ID,
                DEPT_HEAD_SERIAL_NO
            )VALUES ?
        `;
        const queryValues = results3.map(row => [deptId, row.TEACHER_SERIAL_NO]);
        await pool.query(query, [queryValues]);
        console.log("teacher assigned successfully");
        return { success: true, message: 'Courses offered successfully' };
    } catch (error) {
        console.error('Error during teacher assign:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { deptHeadAssign };