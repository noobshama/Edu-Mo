//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getCourseTitleInfo(deptName) {
    try {
        const query = `
            SELECT C.TITLE
            FROM COURSE C
            JOIN DEPARTMENT D
            ON C.DEPT_ID = D.DEPT_ID
            WHERE D.DEPT_NAME = ? 
        `;
         console.log(query);
        const results = await new Promise((resolve, reject) => {
            pool.query(query, deptName, (error, results) => { // pass query directly, don't call the function
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results.length > 0) {
           
            return { success: true, message: 'Got Course Title information', courseTitleInfo: results };
        } else {
            return { success: false, message: 'Course not found', courseTitleInfo: [] };
        }
    } catch (error) {
        console.error('Error during fetching department name information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
}

module.exports = { getCourseTitleInfo };