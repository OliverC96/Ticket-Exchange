import { CustomError } from "./CustomError";

export class DatabaseConnectionError extends CustomError {
    reason: string = "Failed to connect to MongoDB database";
    statusCode: number = 500;
    constructor() {
        super("Failed to connect to MongoDB database.");
        Object.setPrototypeOf(this, DatabaseConnectionError);
    }
    serializeErrors(): { message: string; field?: string }[] {
        return [
            {
                message: this.reason
            }
        ];
    }
}