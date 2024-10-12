import { deleteBlogItem, getBlogs } from "@/services/blogService";
import { BlogPost } from "@/types/blogTypes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";

const Blogs = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[] | null>(null);
  const router = useRouter();
  const firstRender = useRef(true);

  const { data: session, status } = useSession();

  const fetchBlogs = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const blogsResponse = await getBlogs();
      setBlogs(blogsResponse.data);
      console.log(blogsResponse.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    if (!firstRender.current) {
      fetchBlogs();
    } else {
      firstRender.current = false;
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }


  const changeBlog = async (id: string) => {
    console.log('1')
    router.push(`/blog-posts/${id}`);
    console.log('2')
  };

  const deleteBlog = async (id: string) => {
    const confirmDelete = confirm("Biztosan törölni szeretnéd ezt a blog posztot?");
    if (!confirmDelete) return;
    toast.loading("Törlés folyamatban...");
  
    try {
      await deleteBlogItem(id);
      // Ensure blogs is not undefined
      const newBlogs = blogs?.filter((blog) => blog.id !== id) || [];
      setBlogs(newBlogs.length > 0 ? newBlogs : null); // Set newBlogs or null if empty
      toast.success("Blog sikeresen törölve!");
    } catch (error) {
      console.error("Failed to delete blog:", error);
    } finally {
      toast.dismiss();
    }
  };

  const watchBlog = async (id: string) => {
      router.push(`https://eliteperformance.hu/blog-posts/${blogs?.find((blog) => blog.id === id)?.title.replace(/ /g, "-")}`);
  };

  const createBlog = async () => {
    router.push("/blog-posts/new-post");
  };

  return (
    <div className="w-full h-screen max-h-screen overflow-y-auto bg-white text-black flex flex-col p-10">
      <div className="flex flex-row items-center justify-between">
        <Toaster
          duration={5000}
          position="top-center"
          toastOptions={{
            style: {
              color: "black",
              textAlign: "center",
              width: "fit-content",
            },
          }}
        />
        <h1 className="font-bold text-3xl">Blog posztok</h1>
        <div className="flex flex-row items-center justify-center gap-2">
          <button
                    className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#000001]"
          onClick={() => fetchBlogs()}
          >
            Posztok lekérése
          </button>
        <button
          onClick={() => createBlog()}
          className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#000001]"
          >
          Új poszt
        </button>
          </div>
      </div>
      {
        loading && (
          <div className="w-full h-screen flex justify-center items-center">
            <p className="text-2xl text-black">Betöltés...</p>
          </div>
        )
      }
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
        {
          blogs && blogs.length === 0 && !loading && (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-2xl">Nincs megjeleníthető blog poszt</p>
            </div>
          )
        }
        {blogs && blogs.map((post) => (
          <div key={post.id} className="flex flex-col shadow-lg p-4 rounded-xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="rounded-lg"
            />
            <h2 className="font-bold text-xl mt-4 text-center">{post.title}</h2>
            <button
              onClick={() => watchBlog(post.id.toString())}
              className="w-full h-auto py-2 bg-yellow-500 rounded-xl my-4 hover:bg-yellow-600 transition-all duration-300"
            >
              Megtekintés
            </button>
            <button
              onClick={() => changeBlog(post._id ? post._id.toString() : "")}
              className="w-full h-auto py-2 bg-green-500 rounded-xl mb-4 hover:bg-green-600 transition-all duration-300"
            >
              Szerkesztés
            </button>
            <button
              onClick={() => deleteBlog(post.id.toString())}
              className="w-full h-auto py-2 bg-red-500 rounded-xl mb-4 hover:bg-red-600 transition-all duration-300"
            >
              Törlés
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
