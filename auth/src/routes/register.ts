import express, { Request, Response } from "express";
import { User } from "../models/users";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@ojctickets/common";
import jwt from "jsonwebtoken";

const router = express.Router();

// Defining a route to encapsulate the registration process (i.e., allows new users to register an account with the application)
router.post("/api/users/register", [
        body('email')
            .isEmail()
            .withMessage("Invalid email address"),
        body('password')
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage("Password must be between 4 and 20 characters in length")
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        // Ensuring the provided email address is unique (i.e. no other user in the system currently has the same address)
        const { email, password } = req.body;
        const match = await User.findOne({ email });
        if (match) {
            throw new BadRequestError("Email already in use - please enter a unique email address to register.");
        }

        // Creating a new user document, and saving the user to the users database
        const newUser = User.build({ email, password });
        await newUser.save();

        // Generating a JWT encoding the user's id and email address in the payload
        const userJWT = jwt.sign({
                id: newUser.id,
                email: newUser.email
            },
            process.env.JWT_KEY!   // JWT signing key
        );

        // Storing the JWT on the cookie-session object
        req.session = {
            jwt: userJWT
        };

        res.status(201).send(newUser);

    }
);

export { router as registerRouter };