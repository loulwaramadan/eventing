const mysql = require('mysql2/promise');
const DB_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '', // BLANK PASSWORD for WAMP root
    database: 'eventing_bookings',
    
    // Pool configuration settings for performance
    waitForConnections: true, 
    connectionLimit: 10,      
    queueLimit: 0             
};

// This is for the pool connection
const pool = mysql.createPool(DB_CONFIG);

// If this appears then the database has been successfully conncted
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to MySQL database.');
        connection.release(); 
    })
    .catch(err => {
        console.error(' Database connection failed:', err.message);
        // Exit if the connection fails due to wrong credentials or server status
        process.exit(1); 
    });

// In order to be able to be used in server.js we have to export the pool
module.exports = pool;