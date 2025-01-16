// Initiates a PostHog API query; exposes the resulting response to the client
export default async function(req, res) {
    const { query } = JSON.parse(req.body);
    const response = await fetch(
        `https://us.posthog.com/api/projects/${process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID}/query/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.POSTHOG_KEY_PRIVATE}`
            },
            body: JSON.stringify({
                "query": {
                    "kind": "HogQLQuery",
                    "query": query
                }
            })
        }
    );
    const data = await response.json();
    return res.status(200).send(data);
}