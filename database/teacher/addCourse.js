//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addCourseFunction = async (courseData) => {
    try {
        const { courseCode, courseName, prerequisites, deptName, level, term, credit, userId } = courseData;
        console.log(deptName);
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

        const query = `
            INSERT INTO COURSE (
            COURSE_CODE, 
            TITLE,
            CREDIT,
            DEPT_ID,
            LEVEL,
            TERM
            ) VALUES (?,?,?,?,?,?)
        `;

        const values = [
            courseCode, courseName, credit, deptId, level, term
        ];
        console.log("Query 1:", query, "Values 1:", values);
        await pool.query(query, values, async (error, results) => {
            if (error) {
                console.error('Error executing query 1:', error);
            } else {
                console.log('Query 1 executed successfully');
                const query2 = `
                    SELECT COURSE_ID FROM COURSE
                    WHERE COURSE_CODE =?
                `;
                const results2 = await new Promise((resolve, reject) => {
                    pool.query(query2, courseCode, (error, results) => { // pass query directly, don't call the function
                        if (error) {
                            console.error('Error executing query 2:', error);
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                });
                console.log("Hello");
                console.log(results2);
                if (results2.length <= 0) {
                    return { success: false, message: 'Course not found' };
                }
                const courseId = results2[0].COURSE_ID;
                console.log(courseId);

                console.log(prerequisites);
                const query3 = `
                    SELECT COURSE_ID FROM COURSE
                    WHERE TITLE IN (?)
                `;
                const results3 = await new Promise((resolve, reject) => {
                    pool.query(query3, [prerequisites], (error, results) => { // pass query directly, don't call the function
                        if (error) {
                            console.error('Error executing query 3:', error);
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                });
                if (results3.length <= 0) {
                    return { success: false, message: 'Course 2 not found' };
                }
                console.log(results3);
                const prereqInsertQuery = `INSERT INTO PRE_REQ (COURSE_ID, PREREQ_ID) VALUES ?`;
                const prereqValues = results3.map(row => [courseId, row.COURSE_ID]);
                await pool.query(prereqInsertQuery, [prereqValues]);

                console.log("course added successfully");

                console.log(courseCode);

            }
        });

        return { success: true, message: 'Course added successfully', courseCode };
    } catch (error) {
        console.error('Error during student addition:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { addCourseFunction };