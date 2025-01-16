import { PostHog } from "posthog-node";

export const posthogClient: PostHog = new PostHog(
    process.env.POSTHOG_KEY!,
    {
        host: "https://us.i.posthog.com",
        flushAt: 1 // Flush the event queue after every event
    }
);