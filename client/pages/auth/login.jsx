import {
    FaGithub,
    FaGoogle
} from "react-icons/fa";
import useRequest from "../../hooks/use-request";
import useFormInput from "../../hooks/use-form-input/auth";
import useGoogle from "../../hooks/use-google";
import useGithub from "../../hooks/use-github";
import Router from "next/router";
import Link from "next/link";
import Divider from "../../components/Divider";
import { useState } from "react";
import { usePostHog } from "posthog-js/react";
import { parseDate } from "../../utils/parse_date";

// Displays the login form
export default () => {

    const posthog = usePostHog();

    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [resetMessage, setResetMessage] = useState("");

    const {
        setSubmitted,
        populateForm,
        handleChange
    } = useFormInput({
        onSubmit: async () => await performRequest(),
        setInput
    });

    const { googleAuth } = useGoogle({
        setSubmitted,
        populateForm,
        mode: "login"
    });

    const { githubAuth } = useGithub({
        setSubmitted,
        populateForm,
        mode: "login"
    });

    // POST /api/users/login
    const { performRequest, errors } = useRequest({
        url: "/api/users/login",
        method: "post",
        body: input,
        onSuccess: async (data) => {
            posthog?.identify(data._id, {
                email: data.email
            });
            posthog?.capture("user_logged_in", {
                method: data.auth_method
            });
            await Router.push("/");
        }
    });

    const resetPassword = async () => {
        // Ensures the provided email address is valid
        if (input.email === "" || !input.email.match(/^\S+@\S+\.\S+$/)) {
            setResetMessage("Please enter a valid email address.");
        }
        else {
            posthog?.capture("password_reset_requested", {
                email: input.email
            });
            setResetMessage(`Success! Reset password link sent to ${input.email}`);
            // Send email to the user with a password reset link
            await fetch(
                "/api/reset-password",
                {
                    method: "POST",
                    body: JSON.stringify({
                        customer: {
                            email: input.email
                        },
                        timestamp: parseDate()
                    })
                }
            );
            posthog?.capture("email_sent", {
                recipientEmail: input.email,
                type: "password_reset",
                subject: "Password Reset Requested"
            });
            setInput({
                email: "",
                password: ""
            });
        }
    }

    return (
        <div className="page-wrapper">
            <div className="card p-8 w-3/4 md:w-auto">
                <form className="flex flex-col gap-5" onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                }}>

                    <h1 className="text-2xl font-bold">
                        Login to your account
                    </h1>

                    {/* Third-party login options */}
                    <div className="flex flex-col md:flex-row gap-5">
                        {/* Google OAuth 2.0 */}
                        <button
                            type="button"
                            className="btn-secondary flex gap-2 items-center justify-center"
                            onClick={googleAuth}
                        >
                            <FaGoogle className="text-xl" />
                            Continue with Google
                        </button>
                        {/* GitHub OAuth 2.0 */}
                        <button
                            type="button"
                            className="btn-secondary flex gap-2 items-center justify-center"
                            onClick={githubAuth}
                        >
                            <FaGithub className="text-xl" />
                            Continue with GitHub
                        </button>
                    </div>

                    <Divider type="horizontal" />

                    {/* Native login section */}
                    <div className="form-field" >
                        <label id="email"> Email address </label>
                        <input
                            className="form-input"
                            name="email"
                            type="email"
                            value={input.email}
                            onChange={handleChange}
                            placeholder="name@company.ca"
                        />
                        {/* Reset password status message */}
                        {
                            resetMessage !== "" &&
                                <p className={`${resetMessage.includes("Success!") ? "text-green-400" : "text-red-400"}`}>
                                    { resetMessage }
                                </p>
                        }
                    </div>

                    <div className="form-field" >
                        <div className="flex justify-between">
                            <label id="password"> Password </label>
                            <a
                                className="text-blue-500 hover:cursor-pointer"
                                onClick={resetPassword}
                            >
                                Forgot password?
                            </a>
                        </div>
                        <input
                            className="form-input"
                            name="password"
                            type="password"
                            value={input.password}
                            onChange={handleChange}
                            placeholder="••••••••••••"
                        />
                    </div>

                    {/* Displays any errors encountered during the login process */}
                    { errors &&
                        <ul className="card-error" >
                            { errors.map((err) => (
                                <li key={err.message} > { err.message } </li>
                            ))}
                        </ul>
                    }

                    <button className="btn-primary mt-2" type="submit">
                        Login
                    </button>

                    {/* Redirect new users to the registration page */}
                    <p className="">
                        Don't have an account?
                        <Link
                            href="/auth/register"
                            className="text-blue-500 font-medium ml-1"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );

}