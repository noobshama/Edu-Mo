const {DB_HOST, DB_USERNAME,DB_PASSWORD, DB_NAME }= process.env;

var mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
});

pool.getConnection(function (err, connection) {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        throw err;
    }
    console.log(`${DB_NAME} Database connected successfully!`);

    // Release the connection to the pool
    connection.release();
});

// This event is triggered if an error occurs during the connection
pool.on('error', function (err) {
    console.error('Database pool error:', err.message);
    throw err;
});

module.exports = pool;