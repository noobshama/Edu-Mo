//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const courseDropApprovalFunction = async (data) => {
    try {
        const {  userId, selectedEnrollments} = data;
        console.log(data);
        const query = `
            DELETE FROM ENROLLMENT
            WHERE ENROLLMENT_ID = ? AND STATUS = 'waiting for delete'
        `;
        for (const enrollmentId of selectedEnrollments) {
            await new Promise((resolve, reject) => {
                pool.query(query, [enrollmentId], (error, results) => {
                    if (error) {
                        console.error('Error during deleting enrollment table:', error);
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        }
        return { success: true, message: 'Deleted successfully' };
        
    } catch (error) {
        console.error('Error during deleting enrollment:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { courseDropApprovalFunction };