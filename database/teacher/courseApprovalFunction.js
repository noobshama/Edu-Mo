//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const courseApprovalFunction = async (data) => {
    try {
        const {  userId, selectedEnrollments} = data;
        console.log(data);
        const query = `
            UPDATE ENROLLMENT
            SET STATUS = 'approved'
            WHERE ENROLLMENT_ID = ?
        `;
        for (const enrollmentId of selectedEnrollments) {
            await new Promise((resolve, reject) => {
                pool.query(query, [enrollmentId], (error, results) => {
                    if (error) {
                        console.error('Error during updating enrollment table:', error);
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        }
        return { success: true, message: 'Updated successfully' };
        
    } catch (error) {
        console.error('Error during updating enrollment:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { courseApprovalFunction };