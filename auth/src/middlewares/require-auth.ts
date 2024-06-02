import { NotAuthorizedError } from "../errors/NotAuthorizedError";
import { Request, Response, NextFunction } from "express";

// Limits access to internal routes based on the current user's authentication status
// Note: requires the "currentUser" middleware to be called prior to its invocation
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    // If the current user is not authenticated, throw an error
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }
    // Otherwise, allow the user to access the desired resource
    next();
};