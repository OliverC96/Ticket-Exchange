import { useEffect, useState } from "react";
import useFormInput from "../../hooks/use-form-input/auth";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import { useSearchParams } from "next/navigation";
import { PiArrowBendRightDownBold } from "react-icons/pi";
import { usePostHog } from "posthog-js/react";
import axios from "axios";

// Displays the password reset form
export default () => {

    const posthog = usePostHog();

    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const searchParams = useSearchParams();
    const [successMessage, setSuccessMessage] = useState("");

    // Update state upon initial page load
    useEffect(() => {
        setInput({
            email: searchParams.get("email"),
            password: input.password
        });
    }, []);

    // POST /api/users/reset/:email
    const { performRequest, errors } = useRequest({
        url: `/api/users/reset/${input.email}`,
        method: "post",
        body: { password: input.password },
        onSuccess: async (data) => {
            // PostHog user identification
            posthog?.identify(data._id, {
                email: data.email
            });
            // Automatically login the user with their updated password
            await axios.post(
                "/api/users/login",
                {
                    email: data.email,
                    password: data.password
                }
            );
            // Notify PostHog of the successful login
            posthog?.capture("user_logged_in", {
                method: data.auth_method,
                source: "frontend"
            });
            // Redirect user to the homepage after a 5s delay
            setTimeout(() => Router.push("/"), 5000);
        }
    });

    // If the password reset was unsuccessful, redirect user to the homepage after a 5s delay
    useEffect(()=> {
        if (errors) {
            setTimeout(() => Router.push("/"),5000);
        }
    },[errors]);

    const {
        confirm,
        handleChange,
        setSubmitted,
    } = useFormInput({
        onSubmit: async () => await performRequest(),
        setInput
    });

    return (
        <div className="page-wrapper">
            <div className="card p-8 w-1/3 -mt-6">
                <form className="flex flex-col gap-5" onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                }}>

                    <div className="flex gap-2">
                        <h1 className="text-2xl font-bold">
                            Reset your password
                        </h1>
                        <PiArrowBendRightDownBold className="text-3xl mt-3" />
                    </div>

                    <div className="form-field -mt-2">
                        <label id="email"> Email address </label>
                        <input
                            className="form-input"
                            name="email"
                            type="email"
                            value={input.email}
                            disabled
                        />
                    </div>

                    <div className="form-field">
                        <label id="password"> New password </label>
                        <input
                            className="form-input"
                            name="password"
                            type="password"
                            value={input.password}
                            onChange={handleChange}
                            placeholder="••••••••••••"
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

                    {/* Displays any errors encountered during the password reset process */}
                    {errors &&
                        <ul className="card-error">
                            {errors.map((err) => (
                                <li key={err.message}> {err.message} </li>
                            ))}
                        </ul>
                    }

                    {/* Displays success message if the password reset was successful  */}
                    {successMessage !== "" &&
                        <ul className="card-success">
                            <li> {successMessage} </li>
                        </ul>
                    }

                    {/* Form submission button */}
                    <button
                        className={`btn-primary mt-2 ${input.password !== confirm && "cursor-not-allowed"}`}
                        type="submit"
                        disabled={input.password !== confirm}
                    >
                        Save
                    </button>

                </form>
            </div>
        </div>
    );
}