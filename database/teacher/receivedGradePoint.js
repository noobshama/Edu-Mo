const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const receivedGradePoint = async (userGrades) => {
    try {
        // Iterate over each user ID, course code, and grade triplet
        for (const { userRoll, courseCode, grade } of userGrades) {
            // Get the course_id from the course table based on the course_code
            const courseQuery = `SELECT COURSE_ID FROM course WHERE COURSE_CODE = ? `;
            const [courseResult] = await pool.query(courseQuery, [courseCode]);
            const courseId = courseResult[0].COURSE_ID;

            // Perform database update operation for each user and course
            const query = `UPDATE ENROLLMENT SET GRADE = ? WHERE STUDENT_SERIAL_NO = (SELECT USER_SERIAL_NO FROM user WHERE USER_ID = ?) AND  COURSE_ID = ?`;
            await new Promise((resolve, reject) => {
                pool.query(query, [grade, userRoll, courseId], (error, results) => {
                    if (error) {
                        console.error('Error updating grades:', error);
                        reject(error);
                    } else {
                        console.log(`Grade updated for User ID ${userRoll} and Course Code ${courseCode}`);
                        resolve();
                    }
                });
            });
        }
        return { success: true, message: 'Grades updated successfully' };
    } catch (error) {
        console.error('Error updating grades:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { receivedGradePoint };
