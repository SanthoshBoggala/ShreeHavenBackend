const errorHandler = (err, req, res, next)=>{
    const NOT_FOUND = 404
    const VALIDATION_ERROR = 400
    const UNAUTHORIZED = 401
    const FORBIDDEN = 403
    const SERVER_ERROR = 500
    
    const statusCode = res.statusCode ? res.statusCode : 500

    console.log(err);
    switch(statusCode){
        case VALIDATION_ERROR:
            res.json({
                title: "Validation Failed",
                message : err.message,
                stackTrace: err.stack
            })
            break
        case NOT_FOUND:
            res.json({
                title: "Not Found",
                message : err.message,
                stackTrace: err.stack
            })
            break
        case UNAUTHORIZED:
            res.json({
                title: "Unauthorized",
                message : err.message,
                stackTrace: err.stack
            })
            break
        case FORBIDDEN:
            res.json({
                title: "FORBIDDEN",
                message : err.message,
                stackTrace: err.stack
            })
            break  
        case SERVER_ERROR:
            res.json({
                title: "SERVER_ERROR",
                message : err.message,
                stackTrace: err.stack
            })
            break  
        default:
            console.log(err)
            break
    }
};

module.exports = errorHandler;