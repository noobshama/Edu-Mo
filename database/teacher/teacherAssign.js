//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const teacherAssignFunction = async (courseId,teacherSerialNo) => {
    try {
        
          const query = `
            INSERT INTO TEACHER_COURSE(
                TEACHER_SERIAL_NO,
                COURSE_ID
                
            )VALUES(?,?)
        `;
        for (let i = 0; i < courseId.length; i++) {
            const courseNo = courseId[i];
            const teacherId = teacherSerialNo[i];
            
            await new Promise((resolve, reject) => {
                pool.query(query, [teacherId, courseNo], (error, results) => {
                    if (error) {
                        console.error('Error executing course offer insertion query:', error);
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        }
        
        return { success: true, message: 'Courses offered successfully' };
        
    } catch (error) {
        console.error('Error during add offer course:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { teacherAssignFunction };