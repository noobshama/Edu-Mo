//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addOfferCourseFunction = async (data) => {
    try {
        //console.log("Received teacher data:", teacherData);
        const {  userId, semester, deptName, selectedCourses} = data;

        const deptQuery = `
            SELECT DEPT_ID FROM DEPARTMENT
            WHERE DEPT_NAME =?
        `;
        const results = await new Promise((resolve, reject) => {
            pool.query(deptQuery, deptName, (error, results) => { // pass query directly, don't call the function
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results.length <= 0) {
            return { success: false, message: 'Department not found' };
        }
        const deptId = results[0].DEPT_ID;
        console.log(deptId);

        const semQuery = `
            SELECT SEMESTER_ID FROM SEMESTER
            WHERE SEMESTER_NAME =?
        `;
        const results2 = await new Promise((resolve, reject) => {
            pool.query(semQuery, semester, (error, results) => { // pass query directly, don't call the function
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results2.length <= 0) {
            return { success: false, message: 'Semester not found' };
        }
        const semId = results2[0].SEMESTER_ID;

        const query = `
            INSERT INTO COURSE_OFFER(
                COURSE_ID,
                SEMESTER_ID,
                DEPT_ID
            )VALUES(?,?,?)
        `;
        for (const courseId of selectedCourses) {
            await new Promise((resolve, reject) => {
                pool.query(query, [courseId, semId, deptId], (error, results) => {
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

module.exports = { addOfferCourseFunction };