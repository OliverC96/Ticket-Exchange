import "../styles/globals.css";
import "../styles/main.css";
import Header from "../components/Header";
import buildClient from "../api/build-client";
import posthog from "posthog-js";
import { PostHogProvider } from 'posthog-js/react';
import Head from "next/head";
import { useEffect, useRef } from "react";
import { Router, useRouter } from 'next/router'

export default function AppComponent({Component, pageProps, currentUser}) {

    const router = useRouter()
    const oldUrlRef = useRef('')

    useEffect(() => {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
            api_host: "/ingest",
            ui_host: 'https://us.posthog.com',
            person_profiles: 'always',
            // Enable debug mode in development
            loaded: (posthog) => {
                if (process.env.NODE_ENV === 'development') posthog.debug()
            }
        })

        const handleRouteChange = () => posthog?.capture('$pageview')
        const handleRouteChangeStart = () => posthog?.capture('$pageleave', {
            $current_url: oldUrlRef.current
        });

        Router.events.on('routeChangeComplete', handleRouteChange);
        Router.events.on('routeChangeStart', handleRouteChangeStart);

        return () => {
            Router.events.off('routeChangeComplete', handleRouteChange);
            Router.events.off('routeChangeStart', handleRouteChangeStart);
        }
    }, [])

    return (
        <>
            <Head>
                <title> Ticket Exchange </title>
            </Head>
            <PostHogProvider client={posthog}>
                <Header currentUser={currentUser}/>
                <Component currentUser={currentUser} {...pageProps} />
            </PostHogProvider>
        </>
    );
}

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/current-user'); // Retrieve the current user object

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        // Manually invoke the getInitialProps() method associated with the current page (i.e., active component)
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }

    return {
        pageProps,
        ...data // Pass current user object to child components (to enforce authentication requirements)
    };
}