import { useState, useEffect } from "react";
import Router from "next/router";

/**
 * Custom hook which encapsulates a delayed client-side redirect (i.e., redirecting to another page after an n-second delay)
 * @param redirectURL The destination route
 */
export default ({ redirectURL }) => {
    const [redirectSeconds, setRedirectSeconds] = useState(-1);
    const [redirectMessage, setRedirectMessage] = useState("");

    useEffect(() => {
        // State has not yet been initialized by the component
        if (redirectSeconds < 0) {
            return;
        }
        // Initiate a client-side redirect to the specified route
        if (redirectSeconds === 0) {
            Router.push(redirectURL);
            return;
        }
        // Decrement the delay window in 1s intervals
        setTimeout(() => {
            setRedirectSeconds((redirectSeconds) => redirectSeconds - 1);
        }, 1000);
    }, [redirectSeconds]);

    return {
        redirectSeconds,
        redirectMessage,
        setRedirectSeconds,
        setRedirectMessage
    }
}