export default class ErrorHandler extends Error {
    
    constructor(
        public message: string = 'Internal server error',
        public statusCode: number = 500,
        public details?: string
    ) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}
