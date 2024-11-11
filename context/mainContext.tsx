import { BlogPost } from "@/types/blogTypes";
import {
  FC,
  createContext,
  useContext,
  useState,
} from "react";

type MainContextType = any;

const MainContext = createContext<MainContextType | undefined>(undefined);

export const useMainContext = (): MainContextType => {
  const context = useContext(MainContext);
  if (context === undefined) {
    throw new Error("useMainContext must be used within a ContextProvider");
  }
  return context;
};

export const MainContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {

    const [data, setData] = useState<BlogPost>({
        title: "",
        header: "",
        coverImage: "",
        createdAt: new Date().toISOString(),
        id: "",
        category: [],
        postItems: "",
        updatedAt: new Date().toISOString(),
        isPublished: false,
      });

  const value = {
    data,
    setData,
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export default MainContextProvider;
