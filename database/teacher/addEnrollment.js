//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addEnrollmentFunction = async (data) => {
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
            INSERT INTO ENROLLMENT(
                STUDENT_SERIAL_NO,
                COURSE_ID,
                STATUS
            )VALUES(?,?,?)
        `;
        for (const courseId of selectedCourses) {
            await new Promise((resolve, reject) => {
                pool.query(query, [serial, courseId, 'waiting'], (error, results) => {
                    if (error) {
                        console.error('Error executing course offer insertion query:', error);
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        }
        return { success: true, message: 'Enrolled successfully' };
        
    } catch (error) {
        console.error('Error during add enrollment:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { addEnrollmentFunction };