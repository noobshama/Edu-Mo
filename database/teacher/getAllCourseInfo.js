//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getCourseInfo() {
    try {
        const query = `
        SELECT
        c.COURSE_ID,
        c.COURSE_NAME,
        c.CREDIT_HOUR,
        d.DEPARTMENT_NAME
    FROM
        COURSE c
    JOIN
       DEPARTMENT d ON c.DEPARTMENT_ID = d.DEPARTMENT_ID;
        `;
         console.log(query);
        const results = await new Promise((resolve, reject) => {
            pool.query(query, (error, results) => { // pass query directly, don't call the function
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results.length > 0) {
           
            return { success: true, message: 'Got course information', courseInfo: results };
        } else {
            return { success: false, message: 'course not found' };
        }
    } catch (error) {
        console.error('Error during fetching department information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
}

module.exports = { getCourseInfo };



