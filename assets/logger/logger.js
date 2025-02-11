import winston from 'winston';
import dotenv from 'dotenv';
import { pool } from "../db/config/connect.js";
dotenv.config({ path: "./assets/modules/.env" });

let loggerInstance = null;

const createLogger = () => {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            })
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log' })
        ]
    });
};

export function checkLogging() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM logging";
        pool.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results[0]);
        });
    });
}

export const logger = {
    log: (level, message) => {
        if (!loggerInstance) {
            loggerInstance = createLogger();
        }
        loggerInstance.log(level, message);
    },
    info: async (message) => {
        const results = await checkLogging();
        if (results.work) {
            logger.log('info', message);
        }
    },
    error: async (message) => {
        const results = await checkLogging();
        if (results.work) {
            logger.log('error', message);
        }
    }
};