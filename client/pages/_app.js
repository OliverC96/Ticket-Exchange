import "../styles/globals.css";
import "../styles/main.css";
import Header from "../components/Header";
import buildClient from "../api/build-client";
import posthog from "posthog-js";
import { PostHogProvider } from 'posthog-js/react';
import Head from "next/head";
import { useEffect } from "react";
import { Router } from 'next/router'

export default function AppComponent({Component, pageProps, currentUser}) {

    useEffect(() => {
        // Initialize PostHog analytics
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
            api_host: "/ingest", // Use reverse proxy (Next.js rewrites)
            ui_host: 'https://us.posthog.com',
            person_profiles: 'always',
            // Enable debug mode in development
            loaded: (posthog) => {
                if (process.env.NODE_ENV === 'development') posthog.debug()
            },
            autocapture: false,
            capture_pageleave: false,
            capture_dead_clicks: false,
            capture_performance: false
        });

        const handleRouteChange = () => posthog?.capture('$pageview')

        Router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            Router.events.off('routeChangeComplete', handleRouteChange);
        }
    }, []);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
                <meta name="theme-color" content="var(--bg)" />
                <title> Ticket Exchange </title>
            </Head>
            <PostHogProvider client={posthog}>
                <Header currentUser={currentUser} />
                <Component currentUser={currentUser} {...pageProps}/>
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