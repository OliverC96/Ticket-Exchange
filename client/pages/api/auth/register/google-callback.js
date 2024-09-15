// Forwards the Google API access token to /auth/register
export default async function (req, res) {
    console.log("* Google response received!");
    console.log("* Redirecting to /auth/register..");
    res.redirect(process.env.NEXT_PUBLIC_APP_URL + "/auth/register");
}