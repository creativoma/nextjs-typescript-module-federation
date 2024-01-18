import { AppProps } from "next/app";
import Head from "next/head";
import "./styles.css";

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Analytics Module - Remote</title>
        <meta name="description" content="Analytics App" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
