import "../styles/globals.css";
import "../styles/form.css";
import Header from "../components/Header";
import buildClient from "../api/build-client";
import Head from "next/head";

export default function AppComponent({ Component, pageProps, currentUser }) {
    return (
        <div>
          <Head>
              <title> Ticket Exchange </title>
          </Head>
          <Header currentUser={currentUser} />
          <Component currentUser={currentUser} {...pageProps} />
        </div>
    );
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/current-user');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }

  return {
    pageProps,
    ...data
  };
}