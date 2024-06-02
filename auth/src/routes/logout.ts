import express, { Request, Response } from "express";

const router = express.Router();

// Defining a route to encapsulate the logout process
router.post("/api/users/logout", (req: Request, res: Response) => {
    req.session = null; // Clear the JWT from the cookie object on the user's browser
    res.send({});
});

export { router as logoutRouter };