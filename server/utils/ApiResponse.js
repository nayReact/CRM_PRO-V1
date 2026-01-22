class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
export { ApiResponse };

export const sendResponse = (res, statusCode, data, message = "") => {
    return res.status(statusCode).json({
        success: statusCode < 400,
        message,
        data,
    });
}