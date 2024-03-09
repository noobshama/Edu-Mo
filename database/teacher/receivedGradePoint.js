const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const receivedGradePoint = async (userGrades) => {
    try {
        // Iterate over each user ID, course code, and grade triplet
        for (const { student_roll, courseCode, grade } of userGrades) {
            // Get the course_id from the course table based on the course_code
            console.log(student_roll);
            console.log(courseCode);
            console.log(grade);
            const courseQuery = `SELECT COURSE_ID FROM course WHERE COURSE_CODE = ? `;
            await new Promise((resolve, reject) => {
                pool.query(courseQuery, [courseCode], (error, results) => {
                    if (error) {
                        console.error('Error getting course ID:', error);
                        reject(error);
                    } else {
                        // Check if the query returned any results
                        if (results.length > 0) {
                            // Extract the COURSE_ID from the result
                            const courseId = results[0].COURSE_ID;
                            console.log(`COURSE_ID ${courseId} and Course Code ${courseCode}`);
                            
                            // Now you can use courseId in your update query
                            const updateQuery = `UPDATE ENROLLMENT SET GRADE = ? WHERE STUDENT_SERIAL_NO = (SELECT USER_SERIAL_NO FROM USER WHERE USER_ID = ?) AND COURSE_ID = ?`;
                            pool.query(updateQuery, [grade, student_roll, courseId], (updateError, updateResults) => {
                                if (updateError) {
                                    console.error('Error updating grades:', updateError);
                                    reject(updateError);
                                } else {
                                    console.log(`Grade updated for Student Roll ${student_roll} and Course Code ${courseCode}`);
                                    resolve();
                                }
                            });
                        } else {
                            console.log(`No course found with code ${courseCode}`);
                            resolve();
                        }
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