//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const dropEnrollmentFunction = async (data) => {
    try {
        const { userId, selectedCourses } = data;
        console.log(userId);

        // Find the serial number of the user
        const findSerialQuery = `
            SELECT USER_SERIAL_NO FROM USER
            WHERE USER_ID = ?
        `;
        const results = await new Promise((resolve, reject) => {
            pool.query(findSerialQuery, userId, (error, results) => {
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

        // Delete enrollments with status 'waiting' for selected courses
        const deleteQuery = `
            DELETE FROM ENROLLMENT
            WHERE STUDENT_SERIAL_NO = ? AND COURSE_ID = ? AND STATUS = 'waiting'
        `;
        for (const courseId of selectedCourses) {
            await new Promise((resolve, reject) => {
                pool.query(deleteQuery, [serial, courseId], (error, results) => {
                    if (error) {
                        console.error('Error executing delete from enrollment table:', error);
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        }

        // Update enrollments with status 'approved' to 'waiting for delete' for selected courses
        const updateQuery = `
            UPDATE ENROLLMENT
            SET STATUS = 'waiting for delete'
            WHERE STUDENT_SERIAL_NO = ? AND COURSE_ID = ? AND STATUS = 'approved'
        `;
        for (const courseId of selectedCourses) {
            await new Promise((resolve, reject) => {
                pool.query(updateQuery, [serial, courseId], (error, results) => {
                    if (error) {
                        console.error('Error executing update in enrollment table:', error);
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




// const dropEnrollmentFunction = async (data) => {
//     try {
//         const {  userId, selectedCourses} = data;
//         console.log(userId);
//         const findSerialQuery = `
//             SELECT USER_SERIAL_NO FROM USER
//             WHERE USER_ID =?
//         `;
//         const results = await new Promise((resolve, reject) => {
//             pool.query(findSerialQuery, userId, (error, results) => { // pass query directly, don't call the function
//                 if (error) {
//                     console.error('Error executing query:', error);
//                     reject(error);
//                 } else {
//                     resolve(results);
//                 }
//             });
//         });
//         if (results.length <= 0) {
//             return { success: false, message: 'Student not found' };
//         }
//         const serial = results[0].USER_SERIAL_NO;
//         console.log(serial);

//         const query = `
//             DELETE FROM ENROLLMENT
//             WHERE STUDENT_SERIAL_NO =? AND COURSE_ID =? AND STATUS = ?
//         `;
//         for (const courseId of selectedCourses) {
//             await new Promise((resolve, reject) => {
//                 pool.query(query, [serial, courseId, 'waiting'], (error, results) => {
//                     if (error) {
//                         console.error('Error executing drop from enrollment table:', error);
//                         reject(error);
//                     } else {
//                         resolve(results);
//                     }
//                 });
//             });
//         }

//         const query2 = `
//         UPDATE ENROLLMENT
//         SET STATUS = 'waiting for delete'
//         WHERE STUDENT_SERIAL_NO =? AND COURSE_ID =? AND STATUS = ?
//         `;
//         for (const courseId of selectedCourses) {
//             await new Promise((resolve, reject) => {
//                 pool.query(query2, [serial, courseId, 'approved'], (error, results) => {
//                     if (error) {
//                         console.error('Error executing drop from enrollment table:', error);
//                         reject(error);
//                     } else {
//                         resolve(results);
//                     }
//                 });
//             });
//         }
//          return { success: true, message: 'Dropped successfully' };
        
//     } catch (error) {
//         console.error('Error during drop enrollment:', error);
//         return { success: false, message: 'Internal Server Error', error: error.message };
//     }
// };

// module.exports = { dropEnrollmentFunction };