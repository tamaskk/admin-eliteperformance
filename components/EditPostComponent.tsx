import {
  getABlog,
  publishChangeHandler,
  updateBlogItem,
} from "@/services/blogService";
import { BlogPost, PostItems } from "@/types/blogTypes";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "@firebase/storage";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { storage } from "../db/firebase";
import Probaaa from "./probaaa";
import { useMainContext } from "@/context/mainContext";
import { useCurrentEditor, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import FontSize from 'tiptap-extension-font-size'
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";

const EditPostComponent = () => {
  const { data, setData } = useMainContext();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [dragActive, setDragActive] = useState(false);
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);  // Flag to track if we are on the client


  const fetchBlog = async (id: any) => {
    setLoading(true);
    try {
      const blog = await getABlog(id);
      setData({
        ...blog.data,
        updatedAt: new Date().toISOString(),
      });
      console.log(blog.data);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
    }),
    Image.configure({
      inline: true,
      HTMLAttributes: {
        alt: "An image",
      },
    }),
    ImageResize,
    BulletList.configure({
      HTMLAttributes: { class: "list-disc" },
    }),
    OrderedList.configure({
      HTMLAttributes: { class: "list-decimal" },
    }),
    ListItem.configure({
      HTMLAttributes: { class: "list-item" },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ];


  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    const id = router.query.id;

    if (status !== "loading" && session) {
      fetchBlog(id);
    }
  }, [status, session]);

  const createBlog = async () => {
    setData((prevData: any) => {
      const newData = {
        ...prevData,
        updatedAt: new Date().toISOString(),
      };

      return newData;
    });

    try {
      await updateBlogItem(data);
      toast.success("Blog sikeresen frissítve!");
      setData({
        title: "",
        header: "",
        coverImage: "",
        createdAt: "",
        id: "",
        category: [],
        postItems: "",
        updatedAt: "",
        isPublished: false,
      });
      router.replace("/blog-posts");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error occurred");
      }
    }
  };

  const uploadFile = (image: File | null, id: string) => {
    if (!data.title) return;

    if (!image) {
      toast.error("Nem választottál képet!");
      return;
    }

    const imageRef = storageRef(
      storage,
      `${data.title.replace(/ /g, "-").toLowerCase()}/${id}`
    );

    const imageRef2 = storageRef(
      storage,
      `${data.title.replace(/ /g, "-").toLowerCase()}/cover`
    );

    toast.loading("Kép feltöltése folyamatban...");

    // Upload image to storage
    uploadBytes(id === "mainPic" ? imageRef : imageRef2, image)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url: string) => {
            if (id === "mainPic") {
              setData({ ...data, coverImage: url });
              return;
            }

            toast.success("Kép sikeresen feltöltve!");
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error("Ismeretlen hiba történt.");
            }
          });
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Ismeretlen hiba történt.");
        }
      })
      .finally(() => {
        toast.dismiss();
      });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file, "mainPic");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      uploadFile(file, "mainPic");
    }
  };

  const deleteImage = () => {
    setData({ ...data, coverImage: "" });
  };

  const publishChange = async () => {
    try {
      if (!data._id) {
        toast.error("Nincs ID a bloghoz!");
        return;
      }

      const response = await publishChangeHandler({
        isItPublished: data.isPublished,
        id: data._id,
      });

      toast.success(data.isPublished ? "Blog elrejtve" : "Blog publikálva");
      setData({ ...data, isPublished: !data.isPublished });
    } catch (error) {
      console.error("Failed to publish blog:", error);
    }
  };

  return (
    <div className="text-black bg-white h-screen min-h-screen p-10 w-full overflow-y-auto">
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
      <div className="flex flex-row items-center justify-between mb-5">
        <h1 className="font-bold text-3xl">Új poszt</h1>
        <div className="flex flex-row items-center justify-center gap-2">
          <button
            onClick={fetchBlog}
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#000001]"
          >
            Adatok lekérése
          </button>
          <button
            onClick={publishChange}
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#000001]"
          >
            {data.isPublished ? "Elrejtés" : "Publikálás"}
          </button>
          <button
            onClick={() => createBlog()}
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#000001]"
          >
            Mentés
          </button>
        </div>
      </div>
      {loading && (
        <div className="w-full h-screen flex justify-center items-center">
          <p className="text-2xl text-black">Betöltés...</p>
        </div>
      )}
      {!loading && (
        <div className="flex flex-col sm:flex-col justify-start items-center w-full h-full mb-5 pb-5">
          <div className="w-full flex flex-row items-start justify-start">
            <div className="w-full flex flex-col items-start justify-start">
              <div className="flex flex-col mb-5">
                <label htmlFor="" className="font-semibold mb-2">
                  Cím
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="border border-gray-400 p-2 rounded-md w-[365px]"
                  placeholder="Cím"
                />
              </div>

              <div className="flex flex-col mb-5">
                <label htmlFor="" className="font-semibold mb-2">
                  Fejléc (Ez fog megjelenni a főoldalon)
                </label>
                <input
                  type="text"
                  value={data.header}
                  onChange={(e) => setData({ ...data, header: e.target.value })}
                  className="border border-gray-400 p-2 rounded-md w-[365px]"
                  placeholder="Fejléc"
                />
              </div>

              <div className="flex flex-col mb-5">
                <label className="font-semibold mb-2">Típus</label>
                {(
                  [
                    "edzés",
                    "versenyfelkészülés",
                    "regeneráció",
                    "étrend",
                  ] as Array<
                    "edzés" | "versenyfelkészülés" | "regeneráció" | "étrend"
                  >
                ).map((category) => (
                  <label key={category} className="mb-2">
                    <input
                      type="checkbox"
                      value={category}
                      checked={data.category.includes(category)} // Check if the category is selected
                      onChange={(e) => {
                        const selectedCategory = e.target.value as
                          | "edzés"
                          | "versenyfelkészülés"
                          | "regeneráció"
                          | "étrend";

                        // Log the current state and the clicked category
                        if (e.target.checked) {
                          // Add the selected category to the array
                          setData({
                            ...data,
                            category: [...data.category, selectedCategory],
                          });
                        } else {
                          // Remove the category if unchecked
                          setData({
                            ...data,
                            category: data.category.filter(
                              (item: any) => item !== selectedCategory
                            ),
                          });
                        }

                        // Log the state after update
                        console.log("After Update:", data.category);
                      }}
                      className="mr-2"
                    />
                    {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                    {/* Capitalize the first letter */}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold mb-2">
                Kép
              </label>

              {/* Drag-and-Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-[365px] h-[100px] rounded-xl flex items-center p-4 text-sm text-center mb-4 justify-center font-semibold cursor-pointer transition-all duration-300 ${
                  dragActive ? "bg-gray-300" : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => {
                  const coverImageInput = document.getElementById(
                    "coverImage"
                  ) as HTMLInputElement;
                  if (coverImageInput) coverImageInput.click();
                }}
              >
                Kattints ide a kép feltöltéséhez vagy húzd ide a képet
              </div>
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {data.coverImage && (
                <div className="w-[365px] h-auto relative">
                  <img
                    src={data.coverImage}
                    alt="cover preview"
                    className="w-full object-cover rounded-xl"
                  />
                  <DeleteIcon
                    onClick={deleteImage}
                    className="absolute -top-3 -right-3 text-red-500 z-20 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-start h-full">
            <h1 className="font-bold mb-10">Blog tartalom</h1>

            <div className="w-full h-full mt-10 mb-10 max-w-[1136px]">
              <Probaaa />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPostComponent;
