// const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const showDetailsOfDept = async (deptName) => {
    try {
        const query = `
        SELECT 
            DEPT_NAME,
			GET_FULL_DEPARTMENT_NAME(?) AS FULL_NAME,
			count_students_in_department(?) AS SCOUNT, 
			count_teachers_in_department(?) AS TCOUNT,
			count_courses_in_department(?) AS CCOUNT,
			count_offered_courses_in_dept(?) AS OCCOUNT,
			count_students_in_dept_in_level_term(?, ?, ?) AS S11,
			count_students_in_dept_in_level_term(?, ?, ?) AS S12,
			count_students_in_dept_in_level_term(?, ?, ?) AS S21,
			count_students_in_dept_in_level_term(?, ?, ?) AS S22,
			count_students_in_dept_in_level_term(?, ?, ?) AS S31,
			count_students_in_dept_in_level_term(?, ?, ?) AS S32,
			count_students_in_dept_in_level_term(?, ?, ?) AS S41,
			count_students_in_dept_in_level_term(?, ?, ?) AS S42
        FROM DEPARTMENT
        WHERE DEPT_NAME = ?;

        `;
        
        const results = await new Promise((resolve, reject) => {
            pool.query(query, [deptName, deptName, deptName,deptName,deptName,deptName,1,1,deptName,1,2,deptName,2,1,deptName,2,2,deptName,3,1,deptName,3,2,deptName,4,1,deptName,4,2, deptName,deptName,1,1,deptName,1,2,deptName,2,1,deptName,2,2,deptName,3,1,deptName,3,2,deptName,4,1,deptName,4,2], (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        
        if (results.length <= 0) {
            return { success: false, message: 'Nothing found' };
        }

        return { success: true, message: 'Approved course list', results };
    } catch (error) {
        console.error('Error fetching offer course list:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { showDetailsOfDept };