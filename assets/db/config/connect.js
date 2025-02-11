import dotenv from 'dotenv'
import mysql from 'mysql2'
import {logger} from '../../logger/logger.js'

dotenv.config({path: "../modules/.env"})

export const pool = mysql.createPool({
    host: '31.129.101.122',
    port: 3306,
    user: 'admin_botpf',
    password: 'giNKQGO3FJ',
    database: 'admin_botpf',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});

pool.getConnection((err, connection) => {
    if (err) {
        logger.error('Error connecting to MariaDB:', err);
        return;
    }
    logger.info("Connected to MariaDB");
    connection.release();
});





