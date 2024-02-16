//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getTInfo() {
    try {
        const query = `
        SELECT
        t.TEACHER_NAME,
        t.PHONE_NO,
        t.EMAIL,
        t.DESIGNATION,
        t.ADDRESS,
        t.SALARY,
        d.DEPT_NAME
        
FROM
   TEACHER t
LEFT JOIN DEPARTMENT d ON t.DEPT_ID = d.DEPT_ID

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
           
            return { success: true, message: 'Got teacher information', teacherInfo: results };
        } else {
            return { success: false, message: 'teacher not found' };
        }
    } catch (error) {
        console.error('Error during fetching student information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
}

module.exports = { getTInfo };



