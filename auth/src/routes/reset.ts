import express, { Request, Response } from "express";
import { User } from "../models/users";
import { param, body } from "express-validator";
import { NotFoundError, validateRequest, BadRequestError } from "@ojctickets/common";
import { AuthMethod } from "../models/users";

const router = express.Router();

// Defining a route to encapsulate the reset password process (caveat: incompatible with GitHub- and Google-authenticated users)
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

        console.log("User before password reset: ", user);
        if (!user) {
            throw new NotFoundError(); // User does not exist
        }
        // Users authenticated with GitHub or Google cannot reset their password (only natively-authenticated users can)
        if (user.auth_method !== AuthMethod.Native) {
            throw new BadRequestError(`User authenticated with ${user.auth_method} - cannot reset password`);
        }
        user.set({
            password: newPassword // Update the user's password
        });
        await user.save();

        return res.status(200).send(user);
    }
);

export { router as resetPasswordRouter };