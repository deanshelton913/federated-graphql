const winston = require('winston');
const {LOG_LEVEL, NODE_ENV} = process.env;

const getLogger = () => {
    const logger = winston.createLogger({
        silent: NODE_ENV === 'TEST',
        level: LOG_LEVEL || 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console({
                format: winston.format.simple()
            })
        ]
    });

    return logger;
};

const logger = getLogger();

module.exports = {
    logger
}
