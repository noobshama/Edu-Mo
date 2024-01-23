//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getSInfo() {
    try {
        const query = `
        SELECT
    s.STUDENT_ID,
    s.STUDENT_NAME,
    s.SESSION,
    s.SEMESTER,
    CASE WHEN s.IS_RESIDENT = 1 THEN 'Yes' ELSE 'No' END AS IS_RESIDENT,
    d.DEPARTMENT_NAME,
    t.TEACHER_NAME,
    h.HALL_NAME
FROM
    STUDENT s
LEFT JOIN DEPARTMENT d ON s.DEPT_ID = d.DEPARTMENT_ID
LEFT JOIN TEACHER t ON s.TEACHER_ID = t.TEACHER_ID
LEFT JOIN HALL h ON s.HALL_ID = h.HALL_ID;


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
           
            return { success: true, message: 'Got student information', studentInfo: results };
        } else {
            return { success: false, message: 'student not found' };
        }
    } catch (error) {
        console.error('Error during fetching student information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
}

module.exports = { getSInfo };



