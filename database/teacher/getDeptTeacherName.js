//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getDeptTeacherNameInfo(data) {
    const {  userId, deptName} = data;
    console.log("Received department name:", deptName);
        console.log(deptName);
    try {
        const query = `
        SELECT T.TEACHER_NAME, T.TEACHER_SERIAL_NO
        FROM TEACHER T
        JOIN DEPARTMENT D ON T.DEPT_ID = D.DEPT_ID
        WHERE T.DESIGNATION = 'Professor' and D.DEPT_ID=(SELECT DEPT_ID FROM DEPARTMENT WHERE DEPT_NAME= ?);
        
        `;


        const results = await new Promise((resolve, reject) => {
            pool.query(query, [deptName], (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (results.length > 0) {
            return { success: true, message: 'Got teacher information', results };
        } else {
            return { success: false, message: 'teacher not found' };
        }
    } catch (error) {
        console.error('Error during fetching teacher information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { getDeptTeacherNameInfo };