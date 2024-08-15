import {
    FaApple,
    FaGoogle,
    FaFacebook
} from "react-icons/fa";
import useRequest from "../../hooks/use-request";
import useFormInput from "../../hooks/use-form-input/auth";
import Router from "next/router";
import Link from "next/link";
import Divider from "../../components/Divider";

export default () => {

    const { input, confirm, handleChange, handleSubmission } = useFormInput({
        onSubmit: async () => await performRequest()
    })

    const { performRequest, errors } = useRequest({
        url: "/api/users/register",
        method: "post",
        body: input,
        onSuccess: () => Router.push("/")
    });

    return (
        <div className="page-wrapper">
            <div className="card p-8 w-1/2">
                <form className="flex gap-5" onSubmit={handleSubmission}>

                    <div className="flex flex-col gap-5 w-[55%]">
                        <h1 className="text-2xl font-bold">
                            Create an account
                        </h1>

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

                        <button className={`btn-primary ${input.password !== confirm && "cursor-not-allowed"}`} disabled={input.password !== confirm}>
                            Register
                        </button>

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

                    <div className="flex flex-col gap-5 justify-center w-[45%]">
                        <button className="btn-secondary icon-btn">
                            <FaApple className="text-2xl"/>
                            Continue with Apple
                        </button>
                        <button className="btn-secondary icon-btn">
                            <FaGoogle className="text-xl"/>
                            Continue with Google
                        </button>
                        <button className="btn-secondary icon-btn">
                            <FaFacebook className="text-2xl"/>
                            Continue with Facebook
                        </button>
                        { errors &&
                            <ul className="card-error" >
                                { errors.map((err) => (
                                    <li key={err.message} > { err.message } </li>
                                ))}
                            </ul>
                        }
                    </div>

                </form>
            </div>
        </div>
    );

}