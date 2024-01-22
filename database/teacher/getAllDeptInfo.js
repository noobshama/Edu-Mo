//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getDepartmentInfo() {
    try {
        const query = `
            SELECT *
            FROM DEPARTMENT; 
        `;

        const results = await new Promise((resolve, reject) => {
            pool.query(query, allDept, (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (results.length > 0) {
            const deptInfoArray = results.map(result => ({
                // Map each result to an object containing department information
                deptId: result.DEPARTMENT_ID,
                deptName: result.DEPARTMENT_NAME,
                deptHead: result.DEPARTMENT_HEAD,
                // Add more properties as needed
            }));

            return { success: true, message: 'Got department information', deptInfo: deptInfoArray };
        } else {
            return { success: false, message: 'Department not found' };
        }
    } catch (error) {
        console.error('Error during fetching department information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
}

module.exports = { getDepartmentInfo };
