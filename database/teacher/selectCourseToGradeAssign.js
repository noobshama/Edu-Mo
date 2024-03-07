//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');


const getCourseToGrade = async ( courseTitle) => {
    try {
        console.log( courseTitle);
        const query = `
        SELECT 
        U.USER_ID,
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
        COURSE C ON E.COURSE_ID = C.COURSE_ID
    JOIN 
        DEPARTMENT D ON S.DEPT_ID = D.DEPT_ID
    JOIN
        USER U ON S.STUDENT_SERIAL_NO = U.USER_SERIAL_NO
    WHERE 
        LOWER(C.TITLE) = LOWER(?)
        AND E.STATUS = 'approved';
    
   
    
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
