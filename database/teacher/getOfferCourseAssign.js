
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const getOfferCourseAssign = async (deptName) => {
    try {
        console.log("Received department name:", deptName);
        console.log(deptName);
        // Fetch department ID based on department name
        const deptIdQuery = `SELECT DEPT_ID FROM DEPARTMENT WHERE DEPT_NAME = ?`;
        console.log(deptIdQuery);
        const deptIdResults = await new Promise((resolve, reject) => {
            pool.query(deptIdQuery, [deptName], (error, results) => {
                if (error) {
                    console.error('Error fetching department ID:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        console.log("hi");
        if (deptIdResults.length <= 0) {
            return { success: false, message: 'Department not found' };
        }

        const deptId = deptIdResults[0].DEPT_ID;
        console.log(deptId);
        const query = `
        SELECT DISTINCT 
    (SELECT D.DEPT_NAME FROM DEPARTMENT D WHERE CO.DEPT_ID = D.DEPT_ID) AS DEPT_NAME, 
    C.LEVEL, 
    C.TERM, 
    C.TITLE, 
    C.CREDIT, 
    C.COURSE_CODE, 
    C.COURSE_ID
FROM 
    COURSE_OFFER CO 
JOIN 
    COURSE C ON C.COURSE_ID = CO.COURSE_ID
WHERE 
    CO.DEPT_ID = ? AND
    C.COURSE_ID NOT IN (SELECT TC.COURSE_ID FROM TEACHER_COURSE TC WHERE TC.COURSE_ID IS NOT NULL)
        `;
        // console.log(results);
        const results = await new Promise((resolve, reject) => {
            pool.query(query, [deptId], (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (results.length <= 0) {
            return { success: false, message: 'No proposed courses found' };
        }

        return { success: true, message: 'Proposed Courses', results };
    } catch (error) {
        console.error('Error executing query:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { getOfferCourseAssign };
