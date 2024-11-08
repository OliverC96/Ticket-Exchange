import express, { Request, Response } from "express";
import { User } from "../models/users";
import { param, body } from "express-validator";
import { NotFoundError, validateRequest } from "@ojctickets/common";

const router = express.Router();

// Defining a route to encapsulate the reset password process
router.post(
    "/api/users/reset/:email",
    param("email")
        .isEmail()
        .withMessage("Invalid email address."),
    body("password")
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage("Password must be between 4 and 20 characters in length"),
    validateRequest,
    async (req: Request, res: Response) => {
        const { password: newPassword } = req.body;
        const { email: userEmail } = req.params;
        const user = await User.findOne({ email: userEmail }); // Retrieve the user
        if (!user) {
            throw new NotFoundError(); // User does not exist
        }
        user.set({
            password: newPassword // Update the user's password
        });
        await user.save();

        return res.status(200).send(user);
    }
);

export { router as resetPasswordRouter };