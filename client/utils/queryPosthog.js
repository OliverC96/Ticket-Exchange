const queryPosthog = async ({ query }) => {
    const res = await fetch(
        `https://us.posthog.com/api/projects/${process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID}/query/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_API_KEY}`
            },
            body: JSON.stringify({
                "query": {
                    "kind": "HogQLQuery",
                    "query": query
                }
            })
        }
    );
    return await res.json();
};

export { queryPosthog };