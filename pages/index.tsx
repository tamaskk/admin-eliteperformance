import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Nav from "../components/Nav";

const index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/blog-posts");
  }, []);

  return (
    <div>
      <Head>
        <title>Admin Eliteperformance</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
    </div>
  );
};

export default index;
