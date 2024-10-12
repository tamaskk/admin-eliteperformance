import RegisterComponent from "@/components/register";
import { SessionProvider } from "next-auth/react";
import React from "react";

const Register = () => {
  return (
    <div className="w-screen h-screen flex items-center flex-col justify-center gap-4">
      <SessionProvider>
        <RegisterComponent />
      </SessionProvider>
    </div>
  );
};

export default Register;
