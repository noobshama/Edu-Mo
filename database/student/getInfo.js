//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getStudentInfo(userId) {
    try {
        const query = `
            SELECT S.STUDENT_NAME,S.PHONE_NO,S.EMAIL,S.ADDRESS,S.DATE_OF_BIRTH,S.NID,S.LEVEL,S.TERM,H.HALL_NAME,D.DEPT_NAME,T.TEACHER_NAME
            FROM STUDENT S
            JOIN DEPARTMENT D ON S.DEPT_ID = D.DEPT_ID
            JOIN HALL H ON S.HALL_ID = H.HALL_ID
            JOIN TEACHER T ON S.ADVISOR_SERIAL_NO = T.TEACHER_SERIAL_NO
            WHERE STUDENT_SERIAL_NO = (SELECT USER_SERIAL_NO FROM USER WHERE USER_ID = ?);
        `;
       


        const results = await new Promise((resolve, reject) => {
            pool.query(query, userId, (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (results.length > 0) {
            const studentInfo = results[0];
            return { success: true, message: 'Got student information', studentInfo };
        } else {
            return { success: false, message: 'Student not found' };
        }
        console.log(results.length);
    } catch (error) {
        console.error('Error during fetching student information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { getStudentInfo };