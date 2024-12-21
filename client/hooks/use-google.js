import { useEffect } from "react";
import { md5 } from "hash-wasm";
import Router from "next/router";

// Google OAuth 2.0 custom hook
export default ({ setSubmitted, setMethod, populateForm, mode }) => {

    // Authenticates a user via Google OAuth 2.0
    const googleAuth = async () => {

        // Define query params
        const params = new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            redirect_uri: process.env.NEXT_PUBLIC_APP_URL + `/api/auth/${mode}/google-callback`,
            response_type: "token",
            scope: process.env.NEXT_PUBLIC_GOOGLE_SCOPE
        }).toString();

        // Initiate Google OAuth 2.0 authentication flow
        await Router.push(process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENDPOINT + "?" + params);

    }

    // Helper method responsible for extracting the user's email from the Google API response object
    const extractEmail = async (googleResponse) => {
        const reader = googleResponse.body.getReader();
        const rawData = await reader.read();
        const strData = new TextDecoder().decode(rawData.value);
        const cleanData = strData.replace(/['"]+/g, '');
        const startIndex = cleanData.indexOf("email");
        const endIndex = cleanData.indexOf(",", startIndex);
        return cleanData.slice(startIndex, endIndex).split(" ")[1];
    }

    // Parse Google API response on page redirect (when applicable)
    useEffect(() => {
        const hash = location.hash.slice(1);
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get("access_token");

        // Proceed only if the Google API response has been successfully received
        if (accessToken) {

            const fetchData = async() => {
                // Send a GET request to Google's OAuth 2.0 API
                fetch(
                    process.env.NEXT_PUBLIC_GOOGLE_USER_API,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}` // Include the access token
                        }
                    }
                )
                    .then(async (response) => {
                        const email = await extractEmail(response);
                        const password = await md5(email);
                        populateForm(email, password); // Fill the form with the obtained credentials
                        mode === "register" && setMethod("google"); // Set the authentication method for analytics monitoring
                        setSubmitted(true); // Submit the form
                    });
            }
            fetchData();
        }
    }, []);

    return { googleAuth };
}