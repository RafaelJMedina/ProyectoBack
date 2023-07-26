import winston from 'winston';
import { __dirname } from "../utils.js";
import path from 'path'
import * as dotenv from 'dotenv';

dotenv.config();

const currentEnv = process.env.NODE_ENV || 'development';

const customLevels = {
    
    levels: {
        fatal:0,
        error:1,
        warn:2,
        info:3,
        http:4,
        verbose:5,
        debug:6,
        silly:7,
    },

    colors: {
        fatal:'cyan',
        error:'red',
        warn:'yellow',
        info:'blue',
        http:'green',
        verbose:'white',
        debug:'purple',
        silly:'gray',
    },
};

const devLogger = winston.createLogger({
    level: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level:"verbose",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customLevels.colors,
                }),
                winston.format.simple()
            ),
        }),
    ],
});

const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level:'http' }),
        new winston.transports.File({ filename: path.join(__dirname, './middlewares/error.log'), level:'warn'}),
    ],
});

export const addLogger = (req, res, next) => {
    if (currentEnv !== 'development') {
        req.logger = devLogger;
    } else {
        req.logger = prodLogger;
    }
    req.logger.http(`${req.method} en ${req.url}`);
    next();
}