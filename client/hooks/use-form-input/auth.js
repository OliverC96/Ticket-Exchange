import { useState } from "react";

// Custom hook to manage authentication form input
export default ({ onSubmit }) => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [confirm, setConfirm] = useState("");

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
        await onSubmit();
    }

    return { input, confirm, handleChange, handleSubmission };
}