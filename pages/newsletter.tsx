import Nav from "@/components/Nav";
import NewsletterComponent from "@/components/Newsletter";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

const index = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-white flex flex-row">
      <Head>
        <title>Admin Eliteperformance</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider>
        <Nav />
        <NewsletterComponent />
      </SessionProvider>
    </div>
  );
};

export default index;
