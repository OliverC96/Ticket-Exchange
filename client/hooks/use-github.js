import Router from 'next/router';
import { useEffect } from "react";
import { md5 } from "hash-wasm";
import { useSearchParams } from "next/navigation";

// GitHub OAuth 2.0 custom hook
export default ({ setSubmitted, populateForm, mode }) => {

    const searchParams = useSearchParams();

    // Authenticates a user via GitHub OAuth 2.0
    const githubAuth = async() => {

        // Define query params
        const params = new URLSearchParams({
            client_id: mode === "register" ? process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID_REGISTER : process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID_LOGIN,
            redirect_uri: process.env.NEXT_PUBLIC_APP_URL + `/api/auth/${mode}/github-callback`
        }).toString();

        // Initiate GitHub OAuth 2.0 authentication flow
        await Router.push(process.env.NEXT_PUBLIC_GITHUB_OAUTH_ENDPOINT + "?" + params);

    }

    // Helper method responsible for extracting the user's email from the GitHub API response object
    const extractEmail = async (githubResponse) => {
        const reader = githubResponse.body.getReader();
        const rawData = await reader.read();
        const strData = new TextDecoder().decode(rawData.value);
        const userEmail = JSON.parse(strData).email;
        const userName = JSON.parse(strData).login;
        return userEmail || (userName + "@gmail.com"); // Artificially construct an email if necessary
    }

    // Parse GitHub API response on page redirect (when applicable)
    useEffect(() => {
        const accessToken = searchParams.get("github_access_token");

        // Proceed only if the GitHub API response has been successfully received
        if (accessToken) {
            const fetchData = async() => {
                // Send a GET request to GitHub's User API
                fetch(
                    process.env.NEXT_PUBLIC_GITHUB_USER_API,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`, // Include the access token
                        }
                    }
                )
                    .then(async (response) => {
                        const email = await extractEmail(response);
                        const password = await md5(email);
                        populateForm(email, password); // Fill the form with the obtained credentials
                        setSubmitted(true); // Submit the form
                    });
            }
            fetchData();
        }
    }, []);

    return { githubAuth };
}