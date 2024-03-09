//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const registerAdmin = async (adminData) => {
    try {
        const { userId, userName, newPassword } = adminData;
        const passwordCheckQuery = `
        SELECT check_password_length(?) AS valid_password
    `;

        // Executing the password check query
        const passwordCheckResult = await new Promise((resolve, reject) => {
            pool.query(passwordCheckQuery, [password], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (!passwordCheckResult[0].valid_password) {
            return { success: false, message: 'Password needs to be at least 8 characters' };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = `
            INSERT INTO USER (
            USER_ID, PASSWORD, ROLE
            ) VALUES (?,?,?)
        `;

        const binds = { userId };

        // const values = [
        //     userId, userName, true// phn_no, email, bank_acc, address, birthdate, hallId, nid, departmentId, designation, joiningDate, birthReg,
        // ];

        const values = [
            userId, hashedPassword, 'admin'
        ];

        //console.log("Query 1:", query, "Values 1:", values);
        console.log("Query:", query, "Values:", values);

        await pool.query(query, values, (error, results) => {
            if (error) {
                console.error('Error executing query 1:', error);
            } else {
                console.log('Query executed successfully');
            }
        });

        // await pool.query(query2, values2, (error, results) => {
        //     if (error) {
        //         console.error('Error executing query 2:', error);
        //     } else {
        //         console.log('Query 2 executed successfully');
        //     }
        // });

        console.log("Admin registration successful");

        console.log(userId);
        return { success: true, message: 'Admin registration successful', userId };
    } catch (error) {
        console.error('Error during admin registration:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { registerAdmin };