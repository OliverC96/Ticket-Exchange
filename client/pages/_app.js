import "../styles/globals.css";
import "../styles/main.css";
import Header from "../components/Header";
import buildClient from "../api/build-client";
import Head from "next/head";

export default function AppComponent({Component, pageProps, currentUser}) {
    return (
        <>
            <Head>
                <title> Ticket Exchange </title>
            </Head>
            <Header currentUser={currentUser}/>
            <Component currentUser={currentUser} {...pageProps} />
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