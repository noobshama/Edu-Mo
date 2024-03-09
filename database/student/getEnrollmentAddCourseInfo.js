//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const getEnrollmentAddCourseInfo = async (userId) => {
    try {
        console.log(userId);
        const query = `
        SELECT DISTINCT 
    C.COURSE_CODE, 
    C.TITLE, 
    C.COURSE_ID, 
    C.CREDIT, 
    S.STUDENT_SERIAL_NO, 
    PR.PREREQ_ID AS PREREQ_COURSE_ID, 
    E2.GRADE
FROM 
    STUDENT S 
JOIN 
    COURSE_OFFER CO ON CO.DEPT_ID = S.DEPT_ID
JOIN 
    COURSE C ON C.COURSE_ID = CO.COURSE_ID
LEFT JOIN 
    ENROLLMENT E1 ON E1.COURSE_ID = CO.COURSE_ID AND E1.STUDENT_SERIAL_NO = S.STUDENT_SERIAL_NO
LEFT JOIN 
    PRE_REQ PR ON PR.COURSE_ID = C.COURSE_ID
LEFT JOIN 
    ENROLLMENT E2 ON E2.COURSE_ID = PR.PREREQ_ID AND E2.STUDENT_SERIAL_NO = S.STUDENT_SERIAL_NO
WHERE 
    S.STUDENT_SERIAL_NO = (SELECT USER_SERIAL_NO FROM USER WHERE USER_ID = ?)
    AND C.LEVEL = S.LEVEL 
    AND C.TERM = S.TERM
    AND (E1.STUDENT_SERIAL_NO IS NULL OR E2.STUDENT_SERIAL_NO IS NULL)
    AND (((
        SELECT COUNT(*) 
        FROM pre_req PR2 
        WHERE PR2.COURSE_ID = C.COURSE_ID
    ) = (
        CASE
            WHEN PR.PREREQ_ID IS NOT NULL AND E2.GRADE >= ? THEN 1
            WHEN PR.PREREQ_ID IS NULL THEN 1
            ELSE 0
        END
    ))  OR PR.PREREQ_ID IS NULL);
        `;
        const results = await new Promise((resolve, reject) => {
            pool.query(query,[userId, 2.15], (error, results) => { 
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

module.exports = { getEnrollmentAddCourseInfo };