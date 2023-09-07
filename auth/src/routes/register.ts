import express, { Request, Response } from "express";
import { User } from "../models/users";
import { body, ValidationError, validationResult, Result } from "express-validator";
import { RequestValidationError } from "../errors/RequestValidationError";
import { BadRequestError } from "../errors/BadRequestError";
import jwt from "jsonwebtoken";

const router = express.Router();

// Defining a route used to register new users with the application
router.post("/api/users/register", [
        body('email')
            .isEmail()
            .withMessage("Invalid email address"),
        body('password')
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage("Password must be between 4 and 20 characters in length")
    ],
    async (req: Request, res: Response) => {

        // Only proceed if the express-validator middleware did not catch any errors with the provided information
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }

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
            process.env.JWT_KEY!
        );

        // Storing the JWT on the cookie-session object
        req.session = {
            jwt: userJWT
        };

        res.status(201).send(newUser);

    }
);

export { router as registerRouter };