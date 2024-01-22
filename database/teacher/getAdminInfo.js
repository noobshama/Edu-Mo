//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getTeacherInfo(userId) {
    try {
        const query = `
            SELECT *
            FROM TEACHER 
            WHERE TEACHER_ID = ?;
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
            const adminInfo = results[0];
            return { success: true, message: 'Got admin information', adminInfo };
        } else {
            return { success: false, message: 'Admin not found' };
        }
        console.log(results.length);
    } catch (error) {
        console.error('Error during fetching admin information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { getTeacherInfo };