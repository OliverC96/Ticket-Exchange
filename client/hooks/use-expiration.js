import { useState, useEffect } from "react";
import { usePostHog } from "posthog-js/react";

/**
 * Custom hook which encapsulates (client-side) order expiration logic
 * @param order The current order document
 * @returns {{timeRemaining: number}} The remaining time (in seconds) until the order expires
 */
export default ({ order }) => {
    const [timeRemaining, setTimeRemaining] = useState(-1);
    const posthog = usePostHog();

    // Display the order expiration window countdown (updated every second)
    useEffect(() => {
        if (timeRemaining === 0) {
            // Dispatch the client-side order expiration event to PostHog
            posthog?.capture("order_expired", {
                id: order.id
            });
        }
        const getTimeRemaining = () => {
            const timeRemainingMS = new Date(order.expiresAt) - new Date();
            setTimeRemaining(Math.round(timeRemainingMS / 1000));
        };
        getTimeRemaining();
        const timerID = setInterval(getTimeRemaining, 1000);
        return () => {
            clearInterval(timerID); // Clear the interval on component unmount
        };
    }, [order]);

    return { timeRemaining };
}