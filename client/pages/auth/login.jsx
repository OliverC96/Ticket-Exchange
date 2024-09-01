import {
    FaApple,
    FaGoogle
} from "react-icons/fa";
import useRequest from "../../hooks/use-request";
import useFormInput from "../../hooks/use-form-input/auth";
import Router from "next/router";
import Link from "next/link";
import Divider from "../../components/Divider";

// Displays the login form
export default () => {

    const { input, handleChange, handleSubmission } = useFormInput({
        onSubmit: async () => await performRequest()
    });

    // POST /api/users/login
    const { performRequest, errors } = useRequest({
        url: "/api/users/login",
        method: "post",
        body: input,
        onSuccess: () => Router.push("/")
    });

    return (
        <div className="page-wrapper">
            <div className="card p-8">
                <form className="flex flex-col gap-5" onSubmit={handleSubmission} >

                    <h1 className="text-2xl font-bold">
                        Login to your account
                    </h1>

                    {/* Third-party login options */}
                    <div className="flex gap-5">
                        <button className="btn-secondary flex gap-2 items-center">
                            <FaApple className="text-2xl" />
                            Continue with Apple
                        </button>
                        <button className="btn-secondary flex gap-2 items-center">
                            <FaGoogle className="text-xl" />
                            Continue with Google
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
                    </div>

                    <div className="form-field" >
                        <div className="flex justify-between">
                            <label id="password"> Password </label>
                            <a href="" className="text-blue-500"> Forgot password? </a>
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