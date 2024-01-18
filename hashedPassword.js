const bcrypt = require('bcryptjs');

// Hash passwords before inserting them into the database
const hashPassword = async (password) => {
    const saltRounds = 10; // You can adjust the number of salt rounds based on your security requirements
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

module.exports = hashPassword;
