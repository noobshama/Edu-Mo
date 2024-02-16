//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getTeacherNameInfo() {
    try {
        const query = `
            SELECT TEACHER_NAME
            FROM TEACHER; 
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
           
            return { success: true, message: 'Got teacher name information', teacherNameInfo: results };
        } else {
            return { success: false, message: 'teacher not found' };
        }
    } catch (error) {
        console.error('Error during fetching teacher name information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
}

module.exports = { getTeacherNameInfo };