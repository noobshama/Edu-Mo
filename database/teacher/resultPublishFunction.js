const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const resultPublishFunction = async () => {
    try {
        const query = `UPDATE RESULT_HISTORY SET IS_RESULT_PUBLISHED = ?`;
        await new Promise((resolve, reject) => {
            pool.query(query, [1], (error, results) => {
                if (error) {
                    console.error('Error updating result publish:', error);
                    reject(error);
                } else {
                    console.log(`IS_RESULT_PUBLISH_UPDATED`);
                    resolve();
                }
            });
        });
        return { success: true, message: 'Result Published successfully' };
    } catch (error) {
        console.error('Error updating result_history:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { resultPublishFunction };