import EditPostComponent from "@/components/EditPostComponent";
import Nav from "@/components/Nav";
import MainContextProvider from "@/context/mainContext";
import { SessionProvider } from "next-auth/react";

const NewPost = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-white flex flex-row">
      <MainContextProvider>
        <SessionProvider>
          <Nav />
          <EditPostComponent />
        </SessionProvider>
      </MainContextProvider>
    </div>
  );
};

export default NewPost;
