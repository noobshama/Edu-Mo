//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const getResultInfo = async (data) => {
    try {
        const {  userId, level, term} = data;
        console.log(data);
        const query = `
        SELECT DISTINCT 
        R.LEVEL, 
        R.TERM, 
        C.TITLE, 
        C.CREDIT, 
        C.COURSE_CODE, 
        C.COURSE_ID,
		R.ENROLLMENT_ID,
		R.GRADE AS GRADEPOINT,
		convertGradePointToGrade(R.GRADE) AS GRADE
        FROM 
            RESULT_HISTORY R 
        JOIN ENROLLMENT E ON (E.ENROLLMENT_ID = R.ENROLLMENT_ID)
        JOIN COURSE C ON (C.COURSE_ID = E.COURSE_ID AND C.LEVEL = R.LEVEL AND C.TERM = R.TERM)
        WHERE R.STUDENT_SERIAL_NO = (SELECT USER_SERIAL_NO FROM USER WHERE USER_ID = ?)
				AND R.LEVEL = ? AND R.TERM = ? 
                AND (SELECT COUNT(*) FROM RESULT_HISTORY WHERE IS_RESULT_PUBLISHED = 1 AND LEVEL = ? AND TERM = ?) = (SELECT COUNT(*) FROM RESULT_HISTORY WHERE LEVEL = ? AND TERM = ?);
        `;
        const results = await new Promise((resolve, reject) => {
            pool.query(query,[userId, level, term, level, term, level, term], (error, results) => { 
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
        
        const query2 = `
        SELECT 
            GET_TOTAL_CGPA((SELECT USER_SERIAL_NO FROM USER WHERE USER_ID = ?), ?,?) AS CGPA, 
            GET_TOTAL_CGPA_ALL_TERM((SELECT USER_SERIAL_NO FROM USER WHERE USER_ID = ?)) AS TOTAL_CGPA;
        `;
        const results2 = await new Promise((resolve, reject) => {
            pool.query(query2,[userId, level, term, userId], (error, results) => { 
                if (error) {
                    console.error('Error executing query 2:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        return { success: true, message: 'result', results, results2};
    } catch (error) {
        console.error('Error executing query:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { getResultInfo };