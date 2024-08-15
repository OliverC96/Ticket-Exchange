import { useState, useEffect } from "react";

export default ({ priceRef, ticket, onSubmit }) => {
    const [input, setInput] = useState({
        title: ticket?.title || "",
        price: ticket?.price.toString() || ""
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (submitted) {
            onSubmit();
        }
    }, [submitted]);

    function handleChange(event) {
        const { name, value } = event.target;
        setInput((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    }

    function onBlur() {
        console.log("BLURRED");
        let value = input.price;
        if (value.charAt(0) === '$') {
            value = value.slice(1);
        }
        value = parseFloat(value);
        if (isNaN(value)) {
            return;
        }
        setInput({
            title: input.title,
            price: "$" + value.toFixed(2)
        });
    }

    async function handleSubmission(event) {
        event.preventDefault();
        priceRef.current.focus();
        priceRef.current.blur();
        setSubmitted(true);
    }

    return { priceRef, input, handleChange, onBlur, handleSubmission };
}