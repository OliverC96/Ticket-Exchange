// Retrieves GitHub API access token, and forwards it to /auth/register
export default async function (req, res) {
    console.log("* GitHub response received!");
    console.log("* Requesting access token..");

    // Define query params
    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID_REGISTER,
        client_secret: process.env.GITHUB_CLIENT_SECRET_REGISTER,
        code: req.query.code
    }).toString();

    // Helper method which extracts the access token property from the GitHub API response object
    const extractAccessToken = async (githubResponse) => {
        const reader = githubResponse.body.getReader();
        const rawData = await reader.read();
        const strData = new TextDecoder().decode(rawData.value);
        return JSON.parse(strData).access_token;
    }

    // Request an access token from the GitHub API
    fetch(
        process.env.GITHUB_ACCESS_TOKEN_API + "?" + params,
        {
            method: "post",
            headers: {
                Accept: "application/json"
            }
        }
    )
        .then(async (response) => {
            console.log("* Access token received!");
            console.log("* Redirecting to /auth/register");

            const accessToken = await extractAccessToken(response);
            const params = new URLSearchParams({
                github_access_token: accessToken
            });

            // Pass on the access token to /auth/register (to complete the authentication process)
            res.redirect(process.env.NEXT_PUBLIC_APP_URL + "/auth/register?" + params);
        })
        .catch((err) => {
            console.log("* Failed to retrieve access token.", err);
            // Redirect to /auth/register without the access token
            res.redirect(process.env.NEXT_PUBLIC_APP_URL + "/auth/register");
        });
}