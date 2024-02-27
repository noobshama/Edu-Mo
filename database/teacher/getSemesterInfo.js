//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

async function getSemesterInfo() {
    try {
        const query = `
            SELECT SEMESTER_NAME
            FROM SEMESTER; 
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
           
            return { success: true, message: 'Got Semester name information', semesterInfo: results };
        } else {
            return { success: false, message: 'Semester not found' };
        }
    } catch (error) {
        console.error('Error during fetching semester information:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
}

module.exports = { getSemesterInfo };