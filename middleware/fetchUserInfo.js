const pool = require('../config/dbConnection'); // Update with actual path to your database connection

const fetchUserInfo = async (req, res, next) => {
    try {
        // Assuming 'userId' is stored in req.session or req.user after successful authentication
        const userId = req.session.userId || req.user.userId; 

        const userInfo = await pool.query('SELECT * FROM USERS WHERE USER_ID = ?', [userId]);
        if (userInfo.length === 0) {
            return res.status(404).send('User not found');
        }

        req.userInfo = userInfo[0];
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = fetchUserInfo;