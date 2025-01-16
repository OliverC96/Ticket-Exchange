import express, { Request , Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@ojctickets/common";
import { User } from "../models/users";
import jwt from "jsonwebtoken";
import { posthogClient } from "../posthog";

const router = express.Router();

// Defining a route to encapsulate the login process (i.e., allows pre-existing users to login to the application)
router.post("/api/users/login",
    [
        body("email")
            .isEmail()
            .withMessage("Invalid email address"),
        body("password")
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage("Password must be between 4 and 20 characters in length.")
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        // Ensuring the provided email address is valid (i.e., corresponds to an existing account/document in the database)
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            throw new BadRequestError("Invalid login credentials.");
        }

        // Ensuring the provided password is correct (i.e., matches the one currently stored in the database)
        const validPassword = await existingUser.validatePassword(password);
        if (!validPassword) {
            throw new BadRequestError("Invalid login credentials.");
        }

        // Generating a JWT encoding the user's id and email address in the payload
        const userJWT = jwt.sign({
                id: existingUser.id,
                email: existingUser.email
            },
            process.env.JWT_KEY!   // JWT signing key
        );

        // Storing the JWT on the cookie-session object
        req.session = {
            jwt: userJWT
        };

        posthogClient!.capture({
            distinctId: existingUser.id,
            event: "user:authenticated",
            properties: {
                source: "auth-srv"
            }
        });

        res.status(200).send(existingUser);

    }
);

export { router as loginRouter };