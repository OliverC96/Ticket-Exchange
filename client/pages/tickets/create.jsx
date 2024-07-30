import useRequest from "../../hooks/use-request";
import Router from "next/router";
import { useState } from "react";
import { IoMdCreate } from "react-icons/io";

export default () => {

    const [input, setInput] = useState({
        title: "",
        price: ""
    });

    const { performRequest, errors } = useRequest({
        url: "/api/tickets",
        method: "post",
        body: input,
        onSuccess: () => Router.push("/")
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setInput((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    }

    async function handleSubmission(event) {
        event.preventDefault();
        await performRequest();
    }

    function onBlur() {
        const value = parseFloat(input.price);
        if (isNaN(value)) {
            return;
        }
        setInput({
            title: input.title,
            price: value.toFixed(2)
        });
    }

    return (
        <div className="page-wrapper">
            <div className="card p-8 w-1/3 -mt-28">
                <form className="flex flex-col gap-5" onSubmit={handleSubmission} >

                    <div className="flex gap-4 items-center text-2xl">
                        <h1 className="font-bold">
                            Create a new ticket
                        </h1>
                        <IoMdCreate />
                    </div>

                    <div className="form-field" >
                        <label id="title"> Title </label>
                        <input
                            className="form-input"
                            name="title"
                            value={input.title}
                            onChange={handleChange}
                            placeholder="Soccer Match"
                        />
                    </div>

                    <div className="form-field" >
                        <label id="price"> Price ($CAD) </label>
                        <input
                            className="form-input"
                            name="price"
                            value={input.price}
                            onChange={handleChange}
                            onBlur={onBlur}
                            placeholder="30"
                        />
                    </div>

                    { errors &&
                        <ul className="card-error" >
                            { errors.map((err) => (
                                <li key={err.message} > { err.message } </li>
                            ))}
                        </ul>
                    }

                    <button className="btn-primary mt-2" >
                        Create
                    </button>

                </form>
            </div>
        </div>
    );
};