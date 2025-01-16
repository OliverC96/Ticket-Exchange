import Stripe from "stripe";

// Export Stripe API singleton
export const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY!,
    {
        // @ts-ignore
        apiVersion: "2024-06-20"
    }
);