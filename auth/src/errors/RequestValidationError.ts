import { ValidationError } from "express-validator";
import { CustomError } from "./CustomError";

export class RequestValidationError extends CustomError {
    statusCode: number = 400;
    constructor(public errors: ValidationError[]) {
        super("Invalid request parameters.");
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors = (): { message: string; field?: string }[] => {
        return this.errors.map((error: ValidationError) => {
            if (error.type === "field") {
                return {
                    message: error.msg,
                    field: error.path
                };
            }
            return {
                message: error.msg
            };
        });
    }
}

