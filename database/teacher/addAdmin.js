//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const registerAdmin = async (adminData) => {
    try {
        const { userId,  newPassword} = adminData;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        

        const query = `
            INSERT INTO USER (
            USER_ID, PASSWORD, ROLE
            ) VALUES (?,?,?)
        `;

        const binds = { userId };

        

        const values = [
            userId, hashedPassword, 'admin'
        ];

        console.log("Query 1:", query, "Values 1:", values);
       
        await pool.query(query, values, (error, results) => {
            if (error) {
                console.error('Error executing query 1:', error);
            } else {
                console.log('Query 1 executed successfully');
            }
        });


        console.log("Admin registration successful");

        console.log(userId);
        return { success: true, message: 'Admin registration successful', userId};
    } catch (error) {
        console.error('Error during admin registration:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { registerAdmin };