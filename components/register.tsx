import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const RegisterComponent = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    
    if (session) {
      router.push('/blog-posts')
    }
  }, [session, status, router])
  
  const registerHandler = async () => {
    try {
      const res = await fetch("/api/auth/registerHandler", {
        method: "POST",
        body: JSON.stringify({ userData }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Account created successfully! ✔️");
      setUserData({ email: "", password: ""});
    } catch (error: any) {
      toast.error(`${error.message} ❌`);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center flex-col justify-center gap-4">
      <h1 className="font-bold text-3xl">Regisztráció</h1>
      <div className="flex flex-col items-center justify-center gap-10">
        <input
          type="text"
          placeholder="Email"
          value={userData.email}
          className="w-72 p-2 rounded-md text-black"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Jelszó"
          className="w-72 p-2 rounded-md text-black"
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="cursor-pointer"
        >
          Jelszó megtekintése
        </button>
        <button
          onClick={registerHandler}
          className="border-2 border-white py-3 px-10 rounded-md hover:bg-gray-700 transition-all duration-300"
        >
          Regisztráció
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;
