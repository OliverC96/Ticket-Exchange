import express, { Request, Response } from "express";
import { posthogClient } from "@ojctickets/common";

const router = express.Router();

// Defining a route to encapsulate the logout process
router.post("/api/users/logout", (req: Request, res: Response) => {
    req.session = null; // Clear the JWT from the cookie object on the user's browser
    posthogClient.capture({
        distinctId: req.currentUser!.id,
        event: "user:deauthenticated"
    });
    res.send({});
});

export { router as logoutRouter };