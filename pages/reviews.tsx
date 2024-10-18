import Nav from "@/components/Nav";
import NewsletterComponent from "@/components/Newsletter";
import ReviewsComponent from "@/components/Reviews";
import Blogs from "@/components/blogs";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const index = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-white flex flex-row">
      <SessionProvider>
        <Nav />
        <ReviewsComponent />
      </SessionProvider>
    </div>
  );
};

export default index;
