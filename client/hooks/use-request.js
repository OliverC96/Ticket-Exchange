import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);
    const performRequest = async() => {
        try {
            setErrors(null);
            let response;
            if (method === "delete") {
                response = await axios[method](url);
            }
            else {
                response = await axios[method](url, body);
            }
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        }
        catch (err) {
            setErrors(err.response.data.errors);
        }
    }
    return { performRequest, errors };
};