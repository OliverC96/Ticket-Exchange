import { useState, useEffect } from "react";

// Custom hook to manage authentication form input (used for both registration and login forms)
export default ({ onSubmit, setInput, checkboxRef }) => {

    const [confirm, setConfirm] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [method, setMethod] = useState("native");

    // Helper method which resets the contents of the authentication form
    const resetForm = () => {
        setInput({
            email: "",
            password: ""
        });
        setConfirm("");
        if (checkboxRef) {
            checkboxRef.current.checked = false;
        }
    }

    // Helper method which populates the authentication form with the given attributes
    const populateForm = (email, password) => {
        setInput({
            email,
            password: password.slice(15)
        });
        setConfirm(password.slice(15));
        if (checkboxRef) {
            checkboxRef.current.checked = true;
        }
    }

    // Updates the input state with the current contents of a form field
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

    useEffect(() => {
        if (submitted) {
            onSubmit();     // Initiate the backend API request
            resetForm();    // Clear the contents of the form
        }
    }, [submitted]);

    return {
        confirm,
        setConfirm,
        setSubmitted,
        method,
        setMethod,
        populateForm,
        handleChange
    };

}