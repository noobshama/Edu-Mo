const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const registerTeacher = async (teacherData) => {
    try {
        const { userId, userName, phn_no, email, bank_acc, address, birthdate, hallId, nid, departmentId, designation, joiningDate, birthReg, newPassword } = teacherData;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = `
            INSERT INTO TEACHER (
            TEACHER_ID, 
            TEACHER_NAME, 
            PHN_NO, 
            EMAIL_ADDRESS, 
            BANK_ACC,
            ADDRESS,
            BIRTH_DATE,
            HALL_ID,
            NID,
            DEPT_ID,
            DESIGNATION,
            JOINING_DATE,
            BIRTH_REG,
            PASSWORD
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        const query2 = `
            INSERT INTO USERS (
            USER_ID, PASSWORD, ROLE
            ) VALUES (?,?,?)
        `;

        const values = [
            userId, userName, phn_no, email, bank_acc, address, birthdate, hallId, nid, departmentId, designation, joiningDate, birthReg, hashedPassword
        ];

        const values2 = [
            userId, hashedPassword, 'teacher'
        ];

        console.log("Query 1:", query, "Values 1:", values);
        console.log("Query 2:", query2, "Values 2:", values2);

        await pool.query(query, values, (error, results) => {
            if (error) {
                console.error('Error executing query 1:', error);
            } else {
                console.log('Query 1 executed successfully');
            }
        });
        
        await pool.query(query2, values2, (error, results) => {
            if (error) {
                console.error('Error executing query 2:', error);
            } else {
                console.log('Query 2 executed successfully');
            }
        });

        console.log("Teacher registration successful");

        return { success: true, message: 'Teacher registration successful' };
    } catch (error) {
        console.error('Error during teacher registration:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { registerTeacher };