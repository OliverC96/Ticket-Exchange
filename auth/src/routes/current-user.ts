import express from "express";
import { currentUser } from "@ojctickets/common";

const router = express.Router();

// Defining a route responsible for retrieving the credentials of the current user
router.get("/api/users/current-user",
    currentUser,
    (req, res) => {
    res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };