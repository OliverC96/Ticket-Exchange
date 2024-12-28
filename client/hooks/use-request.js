import axios from "axios";
import { useState } from "react";

// Custom hook used to initiate a backend API request, and retrieve the resulting data (as well as any error messages)
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
            console.log("ERROR: ", err);
            setErrors(err.response ? err.response.data.errors : null);
        }
    }
    return { performRequest, errors };
};