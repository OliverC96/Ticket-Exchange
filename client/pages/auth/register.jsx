import {
    FaApple,
    FaGoogle
} from "react-icons/fa";
import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

export default () => {

    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [confirm, setConfirm] = useState("");

    const { performRequest, errors } = useRequest({
        url: "/api/users/register",
        method: "post",
        body: input,
        onSuccess: () => Router.push("/")
    });

    function handleChange(event) {
        const { name, value } = event.target;
        if (name === "confirm-password") {
            setConfirm(value);
        }
        else {
            setInput((prev) => {
                return {
                    ...prev,
                    [name]: value
                }
            });
        }
    }

    async function handleSubmission(event) {
        event.preventDefault();
        await performRequest();
    }

    return (
        <div className="bg-blue-dark h-screen flex flex-col justify-center items-center text-blue-xlight">
            <div className="bg-blue-xxdark flex flex-col p-8 rounded-lg outline outline-1 outline-blue-light">
                <form className="flex flex-col gap-5" onSubmit={handleSubmission}>

                    <h1 className="text-2xl font-bold">
                        Create an account
                    </h1>

                    <div className="flex gap-5">
                        <button className="btn-secondary flex gap-2 items-center">
                            <FaApple className="text-2xl"/>
                            Continue with Apple
                        </button>
                        <button className="btn-secondary flex gap-2 items-center">
                            <FaGoogle className="text-xl"/>
                            Continue with Google
                        </button>
                    </div>

                    <div className="flex items-center py-1">
                        <div className="flex-grow border-t border border-1.5 border-blue-light"></div>
                        <span className="flex-shrink mx-4 text-blue-xlight"> or </span>
                        <div className="flex-grow border-t border border-1.5 border-blue-light"></div>
                    </div>

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
                        <input name="terms" type="checkbox" required />
                        <label id="terms"/> I accept the <a href="" className="text-blue-500 font-medium"> Terms and
                        Conditions </a>
                    </div>

                    {errors}

                    <button className={`btn-primary ${input.password !== confirm && "cursor-not-allowed"}`} disabled={input.password !== confirm}>
                        Register
                    </button>

                    <p className="">
                        Already have an account?
                        <a href="" className="text-blue-500 font-medium ml-1">
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );

}