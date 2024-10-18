import Nav from "@/components/Nav";
import NewsletterComponent from "@/components/Newsletter";
import SalesComponent from "@/components/Sales";
import Blogs from "@/components/blogs";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const index = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-white flex flex-row">
      <SessionProvider>
        <Nav />
        <SalesComponent />
      </SessionProvider>
    </div>
  );
};

export default index;