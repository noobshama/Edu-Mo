//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addSemesterFunction = async (semData) => {
    try {
        const { semesterName, userId} = semData;



        const query = `
            INSERT INTO SEMESTER (
           
            SEMESTER_NAME
            ) VALUES (?)
        `;



        //const binds = { userId };

        const values = [
          semesterName
        ];



        console.log("Query 1:", query, "Values 1:", values);

        await pool.query(query, values, (error, results) => {
            if (error) {
                console.error('Error executing query 1:', error);
            } else {
                console.log('Query 1 executed successfully');
            }
        });


        console.log("semester added successfully");

        console.log(semesterName);
        return { success: true, message: 'semester added successfully', semesterName};
    } catch (error) {
        console.error('Error during student addition:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { addSemesterFunction };