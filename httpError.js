class HttpErrors extends Error{
    constructor(errCode, message){
        super();
        this.errCode = errCode;
        this.message = message;
    }
}

module.exports = HttpErrors;