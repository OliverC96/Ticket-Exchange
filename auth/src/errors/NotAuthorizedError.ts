import { CustomError } from "./CustomError";

export class NotAuthorizedError extends CustomError {
    statusCode: number = 401
    constructor() {
        super("User not authorized to access this resource.");
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeErrors = () : { message: string; field?: string }[] => {
        return [{
            message: "User not authorized to access this resource."
        }];
    }
};