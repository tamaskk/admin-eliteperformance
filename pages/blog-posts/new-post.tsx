import Nav from "@/components/Nav";
import Blogs from "@/components/blogs";
import NewPostComponent from "@/components/newPost";
import MainContextProvider from "@/context/mainContext";
import { SessionProvider } from "next-auth/react";
import React from "react";

const NewPost = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-white flex flex-row">
      <MainContextProvider>
        <SessionProvider>
          <Nav />
          <NewPostComponent />
        </SessionProvider>
      </MainContextProvider>
    </div>
  );
};

export default NewPost;
