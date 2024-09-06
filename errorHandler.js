function errorHandler(err, req, res, next) {
    // Send an appropriate response to the client
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error'
        }
    });
}

module.exports = errorHandler