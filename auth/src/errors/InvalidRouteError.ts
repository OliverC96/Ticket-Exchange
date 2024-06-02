import { CustomError } from "./CustomError";

export class InvalidRouteError extends CustomError {
    statusCode: number = 404;
    constructor () {
        super("Route not found, or does not exist.")
        Object.setPrototypeOf(this, InvalidRouteError.prototype);
    }
    serializeErrors = (): { message: string; field?: string }[] => {
        return [
            {
                message: "Route not found, or does not exist."
            }
        ];
    }
}