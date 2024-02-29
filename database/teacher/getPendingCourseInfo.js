//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const getPendingCourseInfo = async (userId) => {
    try {
        //const { semester, departmnt, level, term, userId } = data;
        console.log(userId);



        const query = `
        SELECT 
        (SELECT U.USER_ID FROM USER U WHERE U.USER_SERIAL_NO = S.STUDENT_SERIAL_NO) AS STUDENT_ROLL,
        S.STUDENT_SERIAL_NO,
        S.LEVEL, 
        S.TERM, 
        (SELECT C.COURSE_CODE FROM COURSE C WHERE C.COURSE_ID = E.COURSE_ID) AS COURSE_CODE,
        (SELECT C.TITLE FROM COURSE C WHERE C.COURSE_ID = E.COURSE_ID) AS TITLE,
        (SELECT C.CREDIT FROM COURSE C WHERE C.COURSE_ID = E.COURSE_ID) AS CREDIT,
        E.COURSE_ID, 
        T.TEACHER_SERIAL_NO,
        E.ENROLLMENT_ID
        FROM 
            STUDENT S
        JOIN TEACHER T ON (S.ADVISOR_SERIAL_NO = T.TEACHER_SERIAL_NO)
        JOIN ENROLLMENT E ON (E.STUDENT_SERIAL_NO = S.STUDENT_SERIAL_NO)
        WHERE T.TEACHER_SERIAL_NO = (SELECT U.USER_SERIAL_NO FROM USER U WHERE U.USER_ID = ?)
        AND E.STATUS = ?;
        `;
        const results = await new Promise((resolve, reject) => {
            pool.query(query, [userId, 'waiting'], (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results.length <= 0) {
            return { success: false, message: 'Course not found' };
        }
        return { success: true, message: 'pending course list', results };
    } catch (error) {
        console.error('Error searching offer course list:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { getPendingCourseInfo };