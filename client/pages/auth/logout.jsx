import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

export default function Logout() {
    const { performRequest, errors } = useRequest({
        url: "/api/users/logout",
        method: "post",
        body: {},
        onSuccess: () => Router.push("/")
    });

    useEffect(() => {
        performRequest();
    }, []);
}