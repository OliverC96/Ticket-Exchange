import express, { Request, Response } from "express";
import { posthogClient } from "../index";
import { requireAuth, currentUser } from "@ojctickets/common";

const router = express.Router();

// Defining a route to encapsulate the logout process
router.post(
    "/api/users/logout",
    currentUser,
    requireAuth,
    (req: Request, res: Response) => {
    posthogClient!.capture({
        distinctId: req.currentUser!.id,
        event: "user:deauthenticated",
        properties: {
            source: "auth-srv"
        }
    });
    req.session = null; // Clear the JWT from the cookie object on the user's browser
    res.send({});
});

export { router as logoutRouter };