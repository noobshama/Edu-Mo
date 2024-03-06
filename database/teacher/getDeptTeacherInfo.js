//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getDeptTeacherInfo(data) {
    const {  userId, deptName,courseTitle} = data;
    console.log("Received department name:", deptName);
        console.log(deptName);
    try {
        const query = `
        SELECT T.TEACHER_NAME,T.TEACHER_SERIAL_NO
        FROM TEACHER T
        JOIN DEPARTMENT D ON T.DEPT_ID = D.DEPT_ID
        WHERE D.DEPT_ID = (SELECT C.DEPT_ID FROM COURSE C WHERE C.TITLE = ?);
        `;


        const results = await new Promise((resolve, reject) => {
            pool.query(query, [courseTitle], (error, results) => {
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

module.exports = { getDeptTeacherInfo };