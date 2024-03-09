//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');


const getCourseToGrade = async ( courseTitle) => {
    try {
        console.log( courseTitle);
        const query = `
        
SELECT 
SUBSTR(?, 1, INSTR(?, '-') - 1) AS TIT,
SUBSTR(?, INSTR(?, '-') + 1) AS DNAME,
(SELECT USER_ID FROM USER WHERE USER_SERIAL_NO = s.STUDENT_SERIAL_NO) AS STUDENT_ROLL,
S.LEVEL,
S.TERM,
C.COURSE_CODE,
C.TITLE,
D.DEPT_NAME
FROM 
    STUDENT S
JOIN 
    ENROLLMENT E ON S.STUDENT_SERIAL_NO = E.STUDENT_SERIAL_NO
JOIN 
    COURSE C ON E.COURSE_ID = C.COURSE_ID AND S.LEVEL = C.LEVEL AND S.TERM = C.TERM
JOIN 
    DEPARTMENT D ON S.DEPT_ID = D.DEPT_ID
JOIN
    USER U ON S.STUDENT_SERIAL_NO = U.USER_SERIAL_NO
WHERE
    C.TITLE = SUBSTR(?, 1, INSTR(?, '-') - 1)
    AND S.DEPT_ID = (SELECT DEPT_ID FROM DEPARTMENT D WHERE D.DEPT_NAME = SUBSTR(?, INSTR(?, '-') + 1))
    AND E.STATUS = 'approved';
    
   
    
        `;
        
        const results = await new Promise((resolve, reject) => {
            pool.query(query, [courseTitle,courseTitle,courseTitle,courseTitle,courseTitle,courseTitle,courseTitle,courseTitle], (error, results) => {
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

module.exports = { getCourseToGrade };