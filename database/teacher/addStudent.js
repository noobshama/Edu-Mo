//const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const addStudentFunction = async (studentData) => {
    try {
        const { studentId, studentName, hallName, deptName, teacherName, level, term, password, userId } = studentData;

        const hashedPassword = await bcrypt.hash(password, 10);

        const deptQuery = `
            SELECT DEPT_ID FROM DEPARTMENT
            WHERE DEPT_NAME = ?
        `;

        const teacherQuery = `
            SELECT TEACHER_SERIAL_NO FROM TEACHER
            WHERE TEACHER_NAME = ?
        `;
        const hallQuery = `
            SELECT HALL_ID FROM HALL
            WHERE HALL_NAME = ?
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
        const results1 = await new Promise((resolve, reject) => {
            pool.query(teacherQuery, teacherName, (error, results) => { // pass query directly, don't call the function
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results1.length <= 0) {
            return { success: false, message: 'Teacher serial no not found' };
        }
        const results2 = await new Promise((resolve, reject) => {
            pool.query(hallQuery, hallName, (error, results) => { // pass query directly, don't call the function
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (results2.length <= 0) {
            return { success: false, message: 'hall id not found' };
        }


        const deptId = results[0].DEPT_ID;
        console.log(deptId);
        const teacherSerialno = results1[0].TEACHER_SERIAL_NO;
        console.log(teacherSerialno);
        const hallId = results2[0].HALL_ID;
        console.log(teacherSerialno);
        const userAddQuery = `
            INSERT INTO USER (
                USER_ID,
                PASSWORD,
                ROLE
            ) VALUES (?,?,?)
        `;
        console.log('user add successfully');

        const values = [
            studentId, hashedPassword, 'student'
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
                    pool.query(findSerialQuery, studentId, (error, results) => { // pass query directly, don't call the function
                        if (error) {
                            console.error('Error executing query:', error);
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                });
                if (result.length <= 0) {
                    return { success: false, message: 'Student not found' };}
                    const serial = result[0].USER_SERIAL_NO;
                    console.log(serial);
    
                    const query = `
                INSERT INTO STUDENT (
                STUDENT_SERIAL_NO,
                STUDENT_NAME,
                HALL_ID,
                DEPT_ID,
                TERM,
                LEVEL,
                ADVISOR_SERIAL_NO
                ) VALUES (?,?,?,?,?,?,?)
            `;
    
    
                    const info = await pool.query(query, [serial, studentName, hallId, deptId, term, level, teacherSerialno]);
    
                    const binds = { userId };
    
                    console.log("student added successfully");
    
                    console.log(studentId);
                }
            });
    
            return { success: true, message: 'student added successfully', studentId };
        } catch (error) {
            console.error('Error during student addition:', error);
            return { success: false, message: 'Internal Server Error', error: error.message };
        }
    };
    
    module.exports = { addStudentFunction };