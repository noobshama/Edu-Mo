//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addHallFunction = async (hallData) => {
    try {
        console.log("Received hall data:", hallData);
        const {  hallName, teacherName, userId} = hallData;

       
      
        const teacherQuery = `
            SELECT TEACHER_SERIAL_NO FROM TEACHER
            WHERE TEACHER_NAME = ?
        `;
        const results = await new Promise((resolve, reject) => {
            pool.query(teacherQuery,teacherName, (error, results) => { // pass query directly, don't call the function
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results.length <= 0) {
            return { success: false, message: 'Teacher serial no not found' };
        }
        console.log('sadia');
        const teacherSerialno = results[0].TEACHER_SERIAL_NO;
        console.log(teacherSerialno);
        const hallAddQuery = `
            INSERT INTO HALL (
                HALL_NAME,
                PROVOST_SERIAL_NO
            ) VALUES (?,?)
        `;
        const values = [
            hallName,teacherSerialno
        ];
        await pool.query(hallAddQuery, values, (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                return { success: false, message: 'can not insert user' };
            } else {
                console.log('Query executed successfully');
            }
        });

        
        

        return { success: true, message: 'hall added successfully', teacherSerialno};
    } catch (error) {
        console.error('Error during hall addition:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { addHallFunction };