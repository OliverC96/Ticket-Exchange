import { PostHog } from "posthog-node";

export const posthogClient: PostHog = new PostHog(
    process.env.POSTHOG_KEY! || "phc_NE49LvOVJSBZATykB3x9fLoFi2J1wbcqPmtuhb294og",
    {
        host: "https://us.i.posthog.com",
        flushAt: 1 // Flush the event queue after every event
    }
);