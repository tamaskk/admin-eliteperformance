import RegisterComponent from "@/components/register";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

const Register = () => {
  return (
    <div className="w-screen h-screen flex items-center flex-col justify-center gap-4">
      <Head>
        <title>Admin Eliteperformance</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider>
        <RegisterComponent />
      </SessionProvider>
    </div>
  );
};

export default Register;
