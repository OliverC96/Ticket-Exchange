import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
    statusCode: number = 400;
    constructor (message: string) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError);
    }
    serializeErrors(): { message: string; field?: string }[] {
        return [
            {
                message: this.message,
            }
        ]
    }
}