// const database = require("../database");
const pool = require("../../config/dbConnection");
const bcrypt = require('bcrypt');

const statistics = async () => {
    try {
        const query = `
        SELECT
            (SELECT DEPT_NAME FROM DEPARTMENT WHERE DEPT_ID = S.DEPT_ID) AS DEPT_NAME,
            COUNT(*) AS TSTUDENT,
            CONCAT(FORMAT((COUNT(*) / (SELECT COUNT(*) FROM student) * 100), 1), '%') AS PERCENTAGE
        FROM student S
        GROUP BY DEPT_ID
        ORDER BY PERCENTAGE DESC;

        `;
        
        const results = await new Promise((resolve, reject) => {
            pool.query(query, (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const query2 = `
        SELECT
            (SELECT DEPT_NAME FROM DEPARTMENT WHERE DEPT_ID = T.DEPT_ID) AS DEPT_NAME,
            COUNT(*) AS TTEACHER,
            CONCAT(FORMAT((COUNT(*) / (SELECT COUNT(*) FROM TEACHER) * 100), 1), '%') AS PERCENTAGE
        FROM TEACHER T
        GROUP BY DEPT_ID
        ORDER BY PERCENTAGE DESC;

        `;
        
        const results2 = await new Promise((resolve, reject) => {
            pool.query(query2, (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const query3 = `
        SELECT
            (SELECT DEPT_NAME FROM DEPARTMENT WHERE DEPT_ID = C.DEPT_ID) AS DEPT_NAME,
            COUNT(*) AS TCOURSE,
            CONCAT(FORMAT((COUNT(*) / (SELECT COUNT(*) FROM COURSE) * 100), 1), '%') AS PERCENTAGE
        FROM COURSE C
        GROUP BY DEPT_ID
        ORDER BY PERCENTAGE DESC;

        `;
        
        const results3 = await new Promise((resolve, reject) => {
            pool.query(query3, (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const query4 = `
        SELECT
            (SELECT DEPT_NAME FROM DEPARTMENT WHERE DEPT_ID = CO.DEPT_ID) AS DEPT_NAME,
            COUNT(*) AS TCOURSE,
            CONCAT(FORMAT((COUNT(*) / (SELECT COUNT(*) FROM COURSE_OFFER) * 100), 1), '%') AS PERCENTAGE
        FROM COURSE_OFFER CO
        GROUP BY DEPT_ID
        ORDER BY PERCENTAGE DESC;

        `;
        
        const results4 = await new Promise((resolve, reject) => {
            pool.query(query4, (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        

        return { success: true, message: 'information found', results, results2, results3, results4 };
    } catch (error) {
        console.error('Error fetching offer course list:', error);
        return { success: false, message: 'Internal Server Error', error: error.message };
    }
};

module.exports = { statistics };