//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const getEnrollmentDropCourseInfo = async (userId) => {
    try {
        const query = `
            SELECT (SELECT D.DEPT_NAME FROM DEPARTMENT D WHERE S.DEPT_ID = D.DEPT_ID) AS DEPT_NAME, 
            S.LEVEL, 
            S.TERM, 
            C.TITLE, 
            C.CREDIT, 
            C.COURSE_CODE, 
            C.COURSE_ID
            FROM STUDENT S JOIN ENROLLMENT E
            ON(S.STUDENT_SERIAL_NO = E.STUDENT_SERIAL_NO)
            JOIN COURSE C
            ON C.COURSE_ID = E.COURSE_ID AND S.LEVEL = C.LEVEL AND S.TERM = C.TERM
            WHERE 
            S.STUDENT_SERIAL_NO = (SELECT USER_SERIAL_NO FROM USER U WHERE U.USER_ID = ?) AND E.STATUS <> 'waiting for delete';
        `;
        const results = await new Promise((resolve, reject) => {
            pool.query(query,[userId], (error, results) => { 
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results.length <= 0) {
            return { success: false, message: 'Error occuring query' };
        }
        return { success: true, message: 'Enrollment Drop Course', results};
    } catch (error) {
        console.error('Error executing query:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { getEnrollmentDropCourseInfo };