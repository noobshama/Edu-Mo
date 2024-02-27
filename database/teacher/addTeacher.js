//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addTeacherFunction = async (teacherData) => {
    try {
        console.log("Received teacher data:", teacherData);
        const { teacherId, teacherName, deptName, designation, password, userId } = teacherData;

        const hashedPassword = await bcrypt.hash(password, 10);
        const trimmedDeptName = deptName.trim();

        const deptQuery = `
            SELECT DEPT_ID FROM DEPARTMENT
            WHERE DEPT_NAME = ?
        `;
        const results = await new Promise((resolve, reject) => {
            pool.query(deptQuery, deptName, (error, results) => { // pass query directly, don't call the function
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results.length <= 0) {
            return { success: false, message: 'Department not found' };
        }
        const deptId = results[0].DEPT_ID;
        console.log(deptId);
        const userAddQuery = `
            INSERT INTO USER (
                USER_ID,
                PASSWORD,
                ROLE
            ) VALUES (?,?,?)
        `;
        const values = [
            teacherId, hashedPassword, 'teacher'
        ];
        await pool.query(userAddQuery, values, async (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                return { success: false, message: 'can not insert user' };
            } else {
                console.log('Query executed successfully');
                const findSerialQuery = `
        SELECT USER_SERIAL_NO FROM USER
        WHERE USER_ID =?
    `;
                const result = await new Promise((resolve, reject) => {
                    pool.query(findSerialQuery, teacherId, (error, results) => { // pass query directly, don't call the function
                        if (error) {
                            console.error('Error executing query:', error);
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                });
                if (result.length <= 0) {
                    return { success: false, message: 'Student not found' };
                }
                const serial = result[0].USER_SERIAL_NO;
                console.log(serial);

                const query = `
            INSERT INTO TEACHER (
            TEACHER_SERIAL_NO,
            TEACHER_NAME,
            DEPT_ID,
            DESIGNATION
            ) VALUES (?,?,?,?)
        `;
                const info = await pool.query(query, [serial, teacherName, deptId, designation]);

                const binds = { userId };
                if(info.success)
                {
                    console.log("tttttttttttt");
                }
                console.log("Teacher added successfully");

                console.log(teacherId);
            }
        });

        return { success: true, message: 'Teacher added successfully', teacherId };
    } catch (error) {
        console.error('Error during teacher addition:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { addTeacherFunction };