import LoginComponent from "@/components/login";
import { SessionProvider } from "next-auth/react";

const Login = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <SessionProvider>
        <LoginComponent />
      </SessionProvider>
    </div>
  );
};

export default Login;
