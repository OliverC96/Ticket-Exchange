import express, { Request, Response } from "express";
import { currentUser } from "@ojctickets/common";
import { PostHog } from "posthog-node";

const router = express.Router();

// Defining a route responsible for retrieving the credentials of the current user
router.get("/api/users/current-user",
    currentUser,
    (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };