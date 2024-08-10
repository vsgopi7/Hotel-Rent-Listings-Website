class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCodde= statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;