class ErrorResponse extends Error {
    constructor(errorCode, message = ""){
        super(message);
        this.message = message;
        this.errorCode = errorCode;
    }
}
module.exports = ErrorResponse;