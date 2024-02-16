//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addDepartmentFunction = async (deptData) => {
    try {
        const { deptCode, deptName, userId} = deptData;



        const query = `
            INSERT INTO DEPARTMENT (
            DEPT_CODE, 
            DEPT_NAME
            ) VALUES (?,?)
        `;



        //const binds = { userId };

        const values = [
            deptCode, deptName
        ];



        console.log("Query 1:", query, "Values 1:", values);

        await pool.query(query, values, (error, results) => {
            if (error) {
                console.error('Error executing query 1:', error);
            } else {
                console.log('Query 1 executed successfully');
            }
        });


        console.log("department added successfully");

        console.log(deptCode);
        return { success: true, message: 'Department added successfully', deptCode};
    } catch (error) {
        console.error('Error during student addition:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { addDepartmentFunction };