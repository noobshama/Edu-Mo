// const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const getApprovedCourseList = async (userId) => {
    try {
        const query = `
        SELECT DISTINCT C.TITLE, CONCAT(C.TITLE , '-' , (SELECT DEPT_NAME FROM DEPARTMENT WHERE DEPT_ID = CO.DEPT_ID)) AS FULL_TITLE
FROM ENROLLMENT E 
JOIN COURSE C ON E.COURSE_ID = C.COURSE_ID
JOIN course_offer CO ON CO.COURSE_ID = C.COURSE_ID
WHERE E.COURSE_ID IN (
    SELECT RP.COURSE_ID
    FROM RESULT_PUBLISH RP
    WHERE RP.TEACHER_SERIAL_NO = (
        SELECT T.TEACHER_SERIAL_NO
        FROM TEACHER T
        WHERE T.TEACHER_SERIAL_NO = (
            SELECT U.USER_SERIAL_NO
            FROM USER U
            WHERE U.USER_ID = ?
        )
    )
)
AND E.STATUS = 'approved';

        `;
        
        const results = await new Promise((resolve, reject) => {
            pool.query(query, [userId], (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        
        if (results.length <= 0) {
            return { success: false, message: 'No courses found' };
        }

        return { success: true, message: 'Approved course list', results };
    } catch (error) {
        console.error('Error fetching offer course list:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { getApprovedCourseList };