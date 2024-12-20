import {
    FaGoogle,
    FaGithub
} from "react-icons/fa";
import useRequest from "../../hooks/use-request";
import useFormInput from "../../hooks/use-form-input/auth";
import Router from "next/router";
import Link from "next/link";
import Divider from "../../components/Divider";
import useGoogle from "../../hooks/use-google";
import useGithub from "../../hooks/use-github";
import { useRef, useState } from "react";
import { usePostHog } from "posthog-js/react";

// Displays the register form
export default () => {

    const posthog = usePostHog();

    const checkboxRef = useRef(null);
    const [input, setInput] = useState({
        email: "",
        password: ""
    });

    const {
        confirm,
        method,
        setMethod,
        setSubmitted,
        populateForm,
        handleChange
    } = useFormInput({
        onSubmit: async () => await performRequest(),
        setInput,
        checkboxRef
    });

    const { googleAuth } = useGoogle({
        setSubmitted,
        setMethod,
        populateForm,
        mode: "register"
    });

    const { githubAuth } = useGithub({
        setSubmitted,
        setMethod,
        populateForm,
        mode: "register"
    });

    // POST /api/users/register
    const { performRequest, errors } = useRequest({
        url: "/api/users/register",
        method: "post",
        body: input,
        onSuccess: async (data) => {
            posthog?.identify(data.id, {
                email: data.email
            });
            posthog?.capture("user_registered", {
                method
            });
            await Router.push("/");
        }
    });

    return (
        <div className="page-wrapper">
            <div className="card p-8 w-1/2">
                <form className="flex gap-5" onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                }}>

                    <div className="flex flex-col gap-5 w-[55%]">
                        <h1 className="text-2xl font-bold">
                            Create an account
                        </h1>

                        {/* Native registration section */}
                        <div className="form-field">
                            <label id="email"> Email address </label>
                            <input
                                className="form-input"
                                name="email"
                                placeholder="name@company.ca"
                                value={input.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label id="password"> Password </label>
                            <input
                                className="form-input"
                                name="password"
                                type="password"
                                placeholder="••••••••••••"
                                value={input.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label id="confirm-password"> Confirm password </label>
                            <input
                                className={`${input.password !== confirm && "invalid"} form-input`}
                                name="confirm-password"
                                type="password"
                                placeholder="••••••••••••"
                                value={confirm}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex gap-1 items-center">
                            <input
                                name="terms"
                                type="checkbox"
                                ref={checkboxRef}
                                required
                            />
                            <label id="terms"/> I accept the
                            {/* Terms and conditions link */}
                            <Link
                                href="/auth/terms"
                                className="text-blue-500 font-medium"
                                target="_blank"
                            >
                                Terms and Conditions
                            </Link>
                        </div>

                        <button className={`btn-primary ${input.password !== confirm && "cursor-not-allowed"}`} disabled={input.password !== confirm}>
                            Register
                        </button>

                        {/* Redirect returning/existing users to the login page */}
                        <p className="">
                            Already have an account?
                            <Link
                                href="/auth/login"
                                className="text-blue-500 font-medium ml-1"
                            >
                                Login
                            </Link>
                        </p>

                    </div>

                    <Divider type="vertical" />

                    {/* Third-party registration options */}
                    <div className="flex flex-col gap-5 justify-center w-[45%]">
                        {/* Google OAuth 2.0 */}
                        <button
                            className="btn-secondary icon-btn"
                            onClick={googleAuth}
                        >
                            <FaGoogle className="text-xl"/>
                            Continue with Google
                        </button>
                        {/* GitHub OAuth 2.0 */}
                        <button
                            className="btn-secondary icon-btn"
                            onClick={githubAuth}
                        >
                            <FaGithub className="text-2xl"/>
                            Continue with GitHub
                        </button>
                        {/* Displays any errors encountered during the registration process */}
                        {errors &&
                            <ul className="card-error">
                                {errors.map((err) => (
                                    <li key={err.message}> {err.message} </li>
                                ))}
                            </ul>
                        }
                    </div>

                </form>
            </div>
        </div>
    );

}