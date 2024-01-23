//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getDepartmentInfo() {
    try {
        const query = `
            SELECT *
            FROM DEPARTMENT; 
        `;
         console.log(query);
        const results = await new Promise((resolve, reject) => {
            pool.query(query, (error, results) => { // pass query directly, don't call the function
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results.length > 0) {
           
            return { success: true, message: 'Got department information', deptInfo: results };
        } else {
            return { success: false, message: 'Department not found' };
        }
    } catch (error) {
        console.error('Error during fetching department information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
}

module.exports = { getDepartmentInfo };



