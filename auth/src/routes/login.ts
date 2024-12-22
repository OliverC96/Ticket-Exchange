import express, { Request , Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@ojctickets/common";
import { User } from "../models/users";
import jwt from "jsonwebtoken";

const router = express.Router();

// Defining a route to encapsulate the login process (i.e., allows pre-existing users to login to the application)
router.post("/api/users/login",
    [
        body("email")
            .isEmail()
            .withMessage("Invalid email address"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Invalid password")
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
            console.log("Current password: ", existingUser.password);
            console.log("Login attempt password: ", password);
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

        res.status(200).send(existingUser);

    }
);

export { router as loginRouter };