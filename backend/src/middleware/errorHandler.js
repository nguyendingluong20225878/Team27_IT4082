const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong!';
    let error = process.env.NODE_ENV === 'development' ? err : undefined;

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized access';
    } else if (err.name === 'ForbiddenError') {
        statusCode = 403;
        message = 'Forbidden access';
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        error
    });
};

module.exports = errorHandler; 