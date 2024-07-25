import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);
    const performRequest = async() => {
        try {
            setErrors(null);
            const response = await axios[method](url, body);
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        }
        catch (err) {
            setErrors(
                <ul className="bg-red-300 text-red-dark p-3 rounded-lg list-disc list-inside" >
                    { err.response.data.errors.map((err) => (
                        <li key={err.message}> { err.message } </li>
                    ))}
                </ul>
            );
        }
    }
    return { performRequest, errors };
};