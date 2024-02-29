//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getInfo() {
    try {
        const query = `
            SELECT T.TEACHER_NAME
            FROM TEACHER T
            JOIN DEPARTMENT D ON T.DEPT_ID = D.DEPT_ID
            WHERE TEACHER_SERIAL_NO = (SELECT USER_SERIAL_NO FROM USER WHERE USER_ID = ?);
        `;


        const results = await new Promise((resolve, reject) => {
            pool.query(query, userId, (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (results.length > 0) {
            const teacherInfo = results[0];
            return { success: true, message: 'Got teacher information', teacherInfo };
        } else {
            return { success: false, message: 'teacher not found' };
        }
        console.log(results.length);
    } catch (error) {
        console.error('Error during fetching teacher information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { getInfo };