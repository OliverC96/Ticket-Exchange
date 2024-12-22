import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import { RiExchange2Fill } from "react-icons/ri";
import { usePostHog } from "posthog-js/react";

export default function Logout({ currentUser }) {

    const posthog = usePostHog();

    // POST /api/users/logout
    const { performRequest } = useRequest({
        url: "/api/users/logout",
        method: "post",
        body: {},
        onSuccess: async () => {
            posthog?.capture("user_logged_out");
            posthog?.reset();
            await Router.push("/");
        }
    });

    useEffect(() => {
        performRequest();
    }, []);

    return (
        <div className="w-screen -mt-[10vh] flex justify-center h-screen decal gap-4">
            {/* Logo image */}
            <RiExchange2Fill className="absolute top-20 left-20 text-blue-xlight" size={65} />
        </div>
    );
}