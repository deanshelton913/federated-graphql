const { logger } = require("../shared/logger");
const { FailureByDesign } = require('../shared/failure-by-design');

function getHttpErrorAndStatusCode(err) {
    const surfaceError = { kind: err.type, error: err.message };

    switch (err.type) {
        case 'CONFLICT':
            return { httpStatusCode: 409, surfaceError };
        case 'BAD_REQUEST':
            return { httpStatusCode: 400, surfaceError };
        default:
            logger.error(`Standard 500 body returned to client. Code: ${err.type || 'UNEXPECTED'}. Message: ${err.message}.`);
            logger.error(err);
            return {
                httpStatusCode: 500,
                surfaceError: {
                    kind: 'INTERNAL_SERVER_ERROR',
                    error: 'An unexpected error occurred'
                }
            };
    }
}

function errorHandler(err, _req, res, next) {
    if (!err) {
        next();
        return undefined;
    }
    const error = err.name === 'UnauthorizedError' ? new FailureByDesign('UNAUTHORIZED', err.message) : err;
    const { httpStatusCode, surfaceError } = getHttpErrorAndStatusCode(error);
    res.status(httpStatusCode).send(surfaceError);
    return undefined;
}

module.exports = {
    errorHandler
}
