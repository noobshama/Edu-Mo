//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getStudentInfo(userId) {
    try {
        const query = `
            SELECT *
            FROM STUDENT 
            WHERE STUDENT_ID = ?;
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
            const studentInfo = results[0];
            return { success: true, message: 'Got student information', studentInfo };
        } else {
            return { success: false, message: 'Student not found' };
        }
        console.log(results.length);
    } catch (error) {
        console.error('Error during fetching student information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { getStudentInfo };