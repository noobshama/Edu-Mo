//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const getProposedCourseInfo = async (userId) => {
    try {
        console.log(userId);
        const query = `
        SELECT DISTINCT 
    (SELECT D.DEPT_NAME FROM DEPARTMENT D WHERE S.DEPT_ID = D.DEPT_ID) AS DEPT_NAME, 
    S.LEVEL, 
    S.TERM, 
    C.TITLE, 
    C.CREDIT, 
    C.COURSE_CODE, 
    C.COURSE_ID
FROM 
    STUDENT S 
JOIN 
    COURSE_OFFER CO ON (S.DEPT_ID = CO.DEPT_ID)
JOIN 
    COURSE C ON C.COURSE_ID = CO.COURSE_ID AND S.LEVEL = C.LEVEL AND S.TERM = C.TERM
WHERE 
    S.STUDENT_SERIAL_NO = (SELECT USER_SERIAL_NO FROM USER U WHERE U.USER_ID = ?)
AND 
    (
        NOT EXISTS (
            SELECT * 
            FROM ENROLLMENT E 
            WHERE E.COURSE_ID = C.COURSE_ID AND S.STUDENT_SERIAL_NO = E.STUDENT_SERIAL_NO
        )
        OR
        NOT EXISTS (
            SELECT *
            FROM COURSE
            WHERE COURSE.COURSE_ID NOT IN (
                SELECT ENROLLMENT.COURSE_ID
                FROM ENROLLMENT
                WHERE ENROLLMENT.STUDENT_SERIAL_NO = S.STUDENT_SERIAL_NO
            )
        )
    );
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
        return { success: true, message: 'Proposed Course', results};
    } catch (error) {
        console.error('Error executing query:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { getProposedCourseInfo };