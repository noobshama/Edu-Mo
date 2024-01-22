//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addDepartmentFunction = async (deptData) => {
    try {
        const { deptId, deptName, deptHead, userId} = deptData;

      

        const query = `
            INSERT INTO DEPARTMENT (
            DEPARTMENT_ID, 
            DEPARTMENT_NAME,
            DEPARTMENT_HEAD
            ) VALUES (?,?,?)
        `;

       

        //const binds = { userId };

        const values = [
            deptId, deptName,deptHead
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

        console.log(deptId);
        return { success: true, message: 'Department added successfully', deptId};
    } catch (error) {
        console.error('Error during student addition:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { addDepartmentFunction };