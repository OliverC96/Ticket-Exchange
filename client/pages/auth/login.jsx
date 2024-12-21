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
        method,
        setMethod,
        populateForm,
        handleChange
    } = useFormInput({
        onSubmit: async () => await performRequest(),
        setInput
    });

    const { googleAuth } = useGoogle({
        setSubmitted,
        setMethod,
        populateForm,
        mode: "login"
    });

    const { githubAuth } = useGithub({
        setSubmitted,
        setMethod,
        populateForm,
        mode: "login"
    });

    // POST /api/users/login
    const { performRequest, errors } = useRequest({
        url: "/api/users/login",
        method: "post",
        body: input,
        onSuccess: async (data) => {
            posthog?.identify(data.id, {
                email: data.email
            });
            posthog?.capture("user_logged_in", {
                method,
                id: data.id,
                email: data.email
            });
            console.log(data);
            await Router.push("/");
        }
    });

    const resetPassword = async () => {
        if (input.email === "" || !input.email.match(/^\S+@\S+\.\S+$/)) {
            setResetMessage("Please enter a valid email address.");
        }
        else {
            setResetMessage(`Success! Reset password link sent to ${input.email}`);
            await fetch(
                "/api/reset-password",
                {
                    method: "POST",
                    body: JSON.stringify({
                        customer: {
                            email: input.email
                        }
                    })
                }
            );
            setInput({
                email: "",
                password: ""
            });
        }
    }

    return (
        <div className="page-wrapper">
            <div className="card p-8">
                <form className="flex flex-col gap-5" onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                }}>

                    <h1 className="text-2xl font-bold">
                        Login to your account
                    </h1>

                    {/* Third-party login options */}
                    <div className="flex gap-5">
                        {/* Google OAuth 2.0 */}
                        <button
                            className="btn-secondary flex gap-2 items-center"
                            onClick={googleAuth}
                        >
                            <FaGoogle className="text-2xl" />
                            Continue with Google
                        </button>
                        {/* GitHub OAuth 2.0 */}
                        <button
                            className="btn-secondary flex gap-2 items-center"
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

                    <button className="btn-primary mt-2" >
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