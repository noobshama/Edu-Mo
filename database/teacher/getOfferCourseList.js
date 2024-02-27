//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const getOfferCourseList = async (data) => {
    try {
        //console.log("Received hall data:", hallData);
        const { semester, departmnt, level, term, userId } = data;
        console.log(data);



        const offerCourseListQuery = `
            SELECT C.COURSE_ID, C.TITLE, C.LEVEL, C.TERM, C.CREDIT, 
                (SELECT D.DEPT_NAME FROM DEPARTMENT D WHERE C.DEPT_ID = D.DEPT_ID)
            FROM COURSE C
            WHERE C.LEVEL = ? AND C.TERM = ? 
            AND  C.COURSE_ID NOT IN (
	            SELECT CO.COURSE_ID
                FROM course_offer CO
            );
        `;
        const results = await new Promise((resolve, reject) => {
            pool.query(offerCourseListQuery, [level, term], (error, results) => {
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
        return { success: true, message: 'offer course list', results };
    } catch (error) {
        console.error('Error searching offer course list:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { getOfferCourseList };