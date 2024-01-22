//const database = require("../database");
const pool = require("../config/dbConnection");
const bcrypt = require('bcrypt');

const logInInfo = async (getlogInInfo) => {
  try {
    const { username, password } = getlogInInfo;
    const query = `
        SELECT 
            USER_ID,PASSWORD,ROLE
        FROM 
            USERS
        WHERE USER_ID = ?
            `;

    const values = [ username ];

    const result = await new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          console.error('Error executing query :', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    if (result && result.length > 0) {
      const user = result[0];
      const hashedPasswordFromDB = user.PASSWORD;
      const isPasswordMatch = await bcrypt.compare(password, hashedPasswordFromDB);

      if (isPasswordMatch) {
        let role = user.ROLE;
        if (role === 'student') {
          return { success: true, message: 'Student LogIn successful', username, role };
        }

        else if (role === 'teacher') {
          return { success: true, message: 'Teacher LogIn successful', username, role };
        }

        else if (role === 'admin') {
          return { success: true, message: 'Admin LogIn successful', username, role };
        }
      }
    }
    return { success: false, message: 'User not found or invalid credentials' };

  } catch (error) {
    console.error('Error during admin registration:', error);
    return { success: false, message: 'Internal Server Error', error: error.message };
  }
};
module.exports = { logInInfo };