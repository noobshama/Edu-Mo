//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const dropEnrollmentFunction = async (data) => {
    try {
        const {  userId, selectedCourses} = data;
        console.log(userId);
        const findSerialQuery = `
            SELECT USER_SERIAL_NO FROM USER
            WHERE USER_ID =?
        `;
        const results = await new Promise((resolve, reject) => {
            pool.query(findSerialQuery, userId, (error, results) => { // pass query directly, don't call the function
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results.length <= 0) {
            return { success: false, message: 'Student not found' };
        }
        const serial = results[0].USER_SERIAL_NO;
        console.log(serial);

        const query = `
            DELETE FROM ENROLLMENT
            WHERE STUDENT_SERIAL_NO =? AND COURSE_ID =?
        `;
        for (const courseId of selectedCourses) {
            await new Promise((resolve, reject) => {
                pool.query(query, [serial, courseId], (error, results) => {
                    if (error) {
                        console.error('Error executing drop from enrollment table:', error);
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        }
        return { success: true, message: 'Dropped successfully' };
        
    } catch (error) {
        console.error('Error during drop enrollment:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { dropEnrollmentFunction };