import { getABlog, publishChangeHandler, updateBlogItem } from "@/services/blogService";
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

const EditPostComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BlogPost>({
    title: "",
    header: "",
    coverImage: "",
    category: [],
    createdAt: "",
    id: "",
    postItems: [], // Use an empty array here
    updatedAt: "",
    isPublished: false,
  });
  const [selectedType, setSelectedType] = useState<string>("");
  const firstRender = useRef(true);

  const [dragActive, setDragActive] = useState(false);
  const { data: session, status } = useSession();

  const fetchBlog = async (id: any) => {
    setLoading(true);
    try {
      const blog = await getABlog(id);
      setData({
        ...blog.data,
        updatedAt: new Date().toISOString(),
      });
      console.log(blog.data)
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    } finally {
      setLoading(false);
    }
  };

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
    setData((prevData) => {
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
        postItems: [],
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
            } else {
              setData((prevData: BlogPost) => ({
                ...prevData,
                postItems: prevData.postItems
                  ? prevData.postItems.map((postItem) => {
                      if (postItem.id === id) {
                        return { ...postItem, imageUrl: url };
                      }
                      return postItem;
                    })
                  : [],
              }));
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

  const idGenerator = () => {
    const number = Math.floor(Math.random() * 1000);
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const randomString = Array.from({ length: 10 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");

    const newId = `${number}${randomString}`;

    return newId.toString();
  };

  const addBlogItem = (type: string) => {
    switch (type) {
      case "title":
        setData((prevData: BlogPost) => ({
          ...prevData,
          postItems: [
            ...(prevData.postItems || []),
            { type: "title", title: "", id: idGenerator(), outlined: false },
          ],
        }));
        break;
      case "subTitle":
        setData((prevData: BlogPost) => ({
          ...prevData,
          postItems: [
            ...(prevData.postItems || []),
            {
              type: "subTitle",
              subTitle: "",
              id: idGenerator(),
              outlined: false,
            },
          ],
        }));
        break;
      case "paragraph":
        setData((prevData: BlogPost) => ({
          ...prevData,
          postItems: [
            ...(prevData.postItems || []),
            {
              type: "paragraph",
              paragraph: "",
              id: idGenerator(),
              outlined: false,
            },
          ],
        }));
        break;
      case "image":
        setData((prevData: BlogPost) => ({
          ...prevData,
          postItems: [
            ...(prevData.postItems || []),
            { type: "image", imageUrl: "", id: idGenerator(), outlined: false },
          ],
        }));
        break;
      case "video":
        setData((prevData: BlogPost) => ({
          ...prevData,
          postItems: [
            ...(prevData.postItems || []),
            { type: "video", video: "", id: idGenerator(), outlined: false },
          ],
        }));
        break;
      case "list":
        setData((prevData: BlogPost) => ({
          ...prevData,
          postItems: [
            ...(prevData.postItems || []),
            { type: "list", list: [], id: idGenerator(), outlined: false },
          ],
        }));
        break;
      case "link":
        setData((prevData: BlogPost) => ({
          ...prevData,
          postItems: [
            ...(prevData.postItems || []),
            { type: "link", link: "", id: idGenerator(), outlined: false },
          ],
        }));
        break;
      default:
        console.error("Invalid blog item type");
    }

    setSelectedType("");
  };

  const deleteItem = (id: string) => {
    const confirmDelete = window.confirm("Biztosan törölni szeretnéd?");
    if (!confirmDelete) return;
    const newPostItems =
      data.postItems?.filter((postItem: PostItems) => postItem.id !== id) ||
      null;
    setData({ ...data, postItems: newPostItems });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedType(value);
    addBlogItem(value);
  };

  const publishChange = async () => {
    try {
        if (!data._id) {
            toast.error("Nincs ID a bloghoz!");
            return;
        }

        const response = await publishChangeHandler({ isItPublished: data.isPublished, id: data._id });
        
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
        <div className="flex flex-col sm:flex-row justify-center items-start w-full h-full mb-5 pb-5">
          <div className="w-full sm:w-1/2 flex flex-col items-start justify-start">
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
  <label className="font-semibold mb-2">
    Típus
  </label>
  {(["edzés", "versenyfelkészülés", "regeneráció", "étrend"] as Array<
    "edzés" | "versenyfelkészülés" | "regeneráció" | "étrend"
  >).map((category) => (
    <label key={category} className="mb-2">
      <input
        type="checkbox"
        value={category}
        checked={data.category.includes(category)} // Check if the category is selected
        onChange={(e) => {
          const selectedCategory = e.target.value as "edzés" | "versenyfelkészülés" | "regeneráció" | "étrend";
          
          // Log the current state and the clicked category
          console.log("Selected Category:", selectedCategory);
          console.log("Before Update:", data.category);

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
              category: data.category.filter((item) => item !== selectedCategory),
            });
          }

          // Log the state after update
          console.log("After Update:", data.category);
        }}
        className="mr-2"
      />
      {category.charAt(0).toUpperCase() + category.slice(1)} {/* Capitalize the first letter */}
    </label>
  ))}
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

          <div className="w-full sm:w-1/2 flex flex-col items-center justify-start h-full">
            <h1 className="font-bold mb-10">Blog tartalom</h1>
            <select
              value={selectedType} // Set the controlled value
              onChange={handleChange}
              className="border border-slate-500 px-32 py-4 rounded-lg"
            >
              <option value="" disabled>
                Válassz egy típust
              </option>
              <option value="title">Cím</option>
              <option value="subTitle">Alcím</option>
              <option value="image">Kép</option>
              <option value="paragraph">Szöveg</option>
              <option value="video">Videó</option>
              <option value="list">Lista</option>
              <option value="link">Link</option>
            </select>

            <div className="w-full h-full mt-10 mb-10">
              {data.postItems?.map((item: PostItems, index: number) => {
                switch (item.type) {
                  case "title":
                    return (
                      <div
                        key={index}
                        className="flex flex-col mb-5 bg-slate-100 w-full p-4 rounded-xl shadow-lg relative"
                      >
                        <h1>Cím</h1>
                        <input
                          type="text"
                          value={item.title}
                          placeholder="Cím"
                          className="border border-gray-400 p-2 rounded-md w-[365px]"
                          onChange={(e) => {
                            const newPostItems = data.postItems?.map(
                              (postItem, idx) => {
                                if (index === idx) {
                                  return { ...postItem, title: e.target.value };
                                }
                                return postItem;
                              }
                            );

                            if (newPostItems) {
                              setData({ ...data, postItems: newPostItems });
                            }
                          }}
                        />
                        <div className="flex flex-row items-center justify-start gap-2 mt-5">
                          <label htmlFor="">Kiemelt legyen?</label>
                          <input
                            type="checkbox"
                            checked={item.outlined}
                            onChange={(e) => {
                              const newPostItems = data.postItems?.map(
                                (postItem, idx) => {
                                  if (index === idx) {
                                    return {
                                      ...postItem,
                                      outlined: e.target.checked,
                                    };
                                  }
                                  return postItem;
                                }
                              );

                              if (newPostItems) {
                                setData({ ...data, postItems: newPostItems });
                              }
                            }}
                          />
                        </div>
                        <DeleteIcon
                          onClick={() => deleteItem(item.id)}
                          className="absolute top-3 right-3 text-red-500 z-20 cursor-pointer"
                        />
                      </div>
                    );
                  case "subTitle":
                    return (
                      <div
                        key={index}
                        className="flex flex-col mb-5 bg-slate-100 w-full p-4 rounded-xl shadow-lg relative"
                      >
                        <h1>Alcím</h1>
                        <input
                          type="text"
                          value={item.subTitle}
                          placeholder="Alcím"
                          className="border border-gray-400 p-2 rounded-md w-[365px]"
                          onChange={(e) => {
                            const newPostItems = data.postItems?.map(
                              (postItem, idx) => {
                                if (index === idx) {
                                  return {
                                    ...postItem,
                                    subTitle: e.target.value,
                                  };
                                }
                                return postItem;
                              }
                            );

                            if (newPostItems) {
                              setData({ ...data, postItems: newPostItems });
                            }
                          }}
                        />
                        <div className="flex flex-row items-center justify-start gap-2 mt-5">
                          <label htmlFor="">Kiemelt legyen?</label>
                          <input
                            type="checkbox"
                            checked={item.outlined}
                            onChange={(e) => {
                              const newPostItems = data.postItems?.map(
                                (postItem, idx) => {
                                  if (index === idx) {
                                    return {
                                      ...postItem,
                                      outlined: e.target.checked,
                                    };
                                  }
                                  return postItem;
                                }
                              );

                              if (newPostItems) {
                                setData({ ...data, postItems: newPostItems });
                              }
                            }}
                          />
                        </div>
                        <DeleteIcon
                          onClick={() => deleteItem(item.id)}
                          className="absolute top-3 right-3 text-red-500 z-20 cursor-pointer"
                        />
                      </div>
                    );

                  case "paragraph":
                    return (
                      <div
                        key={index}
                        className="flex flex-col mb-5 bg-slate-100 w-full p-4 rounded-xl shadow-lg relative"
                      >
                        <h1>Szöveg</h1>
                        <textarea
                          key={index}
                          value={item.paragraph}
                          placeholder="Szöveg"
                          className="border border-gray-400 p-2 rounded-md w-[365px]"
                          onChange={(e) => {
                            const newPostItems = data.postItems?.map(
                              (postItem, idx) => {
                                if (index === idx) {
                                  return {
                                    ...postItem,
                                    paragraph: e.target.value,
                                  };
                                }
                                return postItem;
                              }
                            );

                            if (newPostItems) {
                              setData({ ...data, postItems: newPostItems });
                            }
                          }}
                        />
                        <div className="flex flex-row items-center justify-start gap-2 mt-5">
                          <label htmlFor="">Kiemelt legyen?</label>
                          <input
                            type="checkbox"
                            checked={item.outlined}
                            onChange={(e) => {
                              const newPostItems = data.postItems?.map(
                                (postItem, idx) => {
                                  if (index === idx) {
                                    return {
                                      ...postItem,
                                      outlined: e.target.checked,
                                    };
                                  }
                                  return postItem;
                                }
                              );

                              if (newPostItems) {
                                setData({ ...data, postItems: newPostItems });
                              }
                            }}
                          />
                        </div>
                        <DeleteIcon
                          onClick={() => deleteItem(item.id)}
                          className="absolute top-3 right-3 text-red-500 z-20 cursor-pointer"
                        />
                      </div>
                    );

                  case "image":
                    return (
                      <div
                        key={index}
                        className="flex flex-col mb-5 bg-slate-100 w-full p-4 rounded-xl shadow-lg relative"
                      >
                        <h1>Kép</h1>
                        {!item.imageUrl && (
                          <div
                            onClick={() => {
                              const imageInput = document.getElementById(
                                `imageInput-${item.id}`
                              ) as HTMLInputElement;
                              if (imageInput) imageInput.click();
                            }}
                            className="w-[300px] h-[100px] bg-slate-400 rounded-xl flex items-center justify-center text-center hover:bg-slate-500 transition-all duration-300"
                          >
                            Kattints ide a kép feltöltéséhez
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id={`imageInput-${item.id}`} // Assign unique ID here
                          onChange={(e) => {
                            if (!data.title) {
                              toast.error("Először add meg a blog címét!");
                              return;
                            }

                            if (
                              !e.target.files ||
                              e.target.files.length === 0
                            ) {
                              toast.error("Nem választottál képet!");
                              return;
                            }

                            const image = e?.target.files[0];
                            uploadFile(image, item.id); // Make sure this uploads the correct item
                          }}
                        />
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt="image preview"
                            className="w-[300px] object-cover rounded-xl"
                          />
                        )}
                        <div className="flex flex-row items-center justify-start gap-2 mt-5">
                          <label htmlFor="">Kiemelt legyen?</label>
                          <input
                            type="checkbox"
                            checked={item.outlined}
                            onChange={(e) => {
                              const newPostItems = data.postItems?.map(
                                (postItem, idx) => {
                                  if (index === idx) {
                                    return {
                                      ...postItem,
                                      outlined: e.target.checked,
                                    };
                                  }
                                  return postItem;
                                }
                              );

                              if (newPostItems) {
                                setData({ ...data, postItems: newPostItems });
                              }
                            }}
                          />
                        </div>
                        <DeleteIcon
                          onClick={() => deleteItem(item.id)}
                          className="absolute top-3 right-3 text-red-500 z-20 cursor-pointer"
                        />
                      </div>
                    );

                  case "video":
                    return (
                      <div
                        key={index}
                        className="flex flex-col mb-5 bg-slate-100 w-full p-4 rounded-xl shadow-lg relative"
                      >
                        <h1>Videó</h1>
                        <input
                          key={index}
                          type="text"
                          value={item.video}
                          placeholder="Videó link"
                          className="border border-gray-400 p-2 rounded-md w-[365px]"
                          onChange={(e) => {
                            const newPostItems = data.postItems?.map(
                              (postItem, idx) => {
                                if (index === idx) {
                                  return { ...postItem, video: e.target.value };
                                }
                                return postItem;
                              }
                            );

                            if (newPostItems) {
                              setData({ ...data, postItems: newPostItems });
                            }
                          }}
                        />
                        <div className="flex flex-row items-center justify-start gap-2 mt-5">
                          <label htmlFor="">Kiemelt legyen?</label>
                          <input
                            type="checkbox"
                            checked={item.outlined}
                            onChange={(e) => {
                              const newPostItems = data.postItems?.map(
                                (postItem, idx) => {
                                  if (index === idx) {
                                    return {
                                      ...postItem,
                                      outlined: e.target.checked,
                                    };
                                  }
                                  return postItem;
                                }
                              );

                              if (newPostItems) {
                                setData({ ...data, postItems: newPostItems });
                              }
                            }}
                          />
                        </div>
                        <DeleteIcon
                          onClick={() => deleteItem(item.id)}
                          className="absolute top-3 right-3 text-red-500 z-20 cursor-pointer"
                        />
                      </div>
                    );

                  case "list":
                    return (
                      <div
                        key={index}
                        className="flex flex-col mb-5 bg-slate-100 w-full p-4 rounded-xl shadow-lg relative"
                      >
                        <h1>Lista</h1>

                        {item.list.map((listItem, listIdx) => (
                          <input
                            key={listIdx}
                            type="text"
                            value={listItem}
                            placeholder="Lista elem"
                            className="border border-gray-400 p-2 rounded-md w-[365px] mb-2"
                            onChange={(e) => {
                              const newPostItems = data.postItems?.map(
                                (postItem, postItemIdx) => {
                                  if (
                                    index === postItemIdx &&
                                    postItem.type === "list"
                                  ) {
                                    // Ensure postItem is of type List before updating the list item
                                    return {
                                      ...postItem,
                                      list: postItem.list.map((item, i) => {
                                        if (i === listIdx) {
                                          return e.target.value;
                                        }
                                        return item;
                                      }),
                                    };
                                  }
                                  return postItem;
                                }
                              );

                              if (newPostItems) {
                                setData({ ...data, postItems: newPostItems });
                              }
                            }}
                          />
                        ))}

                        <button
                          className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#000001] w-fit"
                          onClick={() => {
                            const newPostItems = data.postItems?.map(
                              (postItem, postItemIdx) => {
                                if (
                                  index === postItemIdx &&
                                  postItem.type === "list"
                                ) {
                                  // Ensure postItem is of type List before adding a new list item
                                  return {
                                    ...postItem,
                                    list: [...postItem.list, ""], // Add an empty string as the new list item
                                  };
                                }
                                return postItem;
                              }
                            );

                            if (newPostItems) {
                              setData({ ...data, postItems: newPostItems });
                            }
                          }}
                        >
                          Listaelem hozzáadása
                        </button>
                        <div className="flex flex-row items-center justify-start gap-2 mt-5">
                          <label htmlFor="">Kiemelt legyen?</label>
                          <input
                            type="checkbox"
                            checked={item.outlined}
                            onChange={(e) => {
                              const newPostItems = data.postItems?.map(
                                (postItem, idx) => {
                                  if (index === idx) {
                                    return {
                                      ...postItem,
                                      outlined: e.target.checked,
                                    };
                                  }
                                  return postItem;
                                }
                              );

                              if (newPostItems) {
                                setData({ ...data, postItems: newPostItems });
                              }
                            }}
                          />
                        </div>
                        <DeleteIcon
                          onClick={() => deleteItem(item.id)}
                          className="absolute top-3 right-3 text-red-500 z-20 cursor-pointer"
                        />
                      </div>
                    );

                  case "link":
                    return (
                      <div
                        key={index}
                        className="flex flex-col mb-5 bg-slate-100 w-full p-4 rounded-xl shadow-lg relative"
                      >
                        <h1>Link</h1>
                        <input
                          key={index}
                          type="text"
                          value={item.link}
                          placeholder="Link"
                          className="border border-gray-400 p-2 rounded-md w-[365px]"
                          onChange={(e) => {
                            const newPostItems = data.postItems?.map(
                              (postItem, idx) => {
                                if (index === idx) {
                                  return { ...postItem, link: e.target.value };
                                }
                                return postItem;
                              }
                            );

                            if (newPostItems) {
                              setData({ ...data, postItems: newPostItems });
                            }
                          }}
                        />
                        <div className="flex flex-row items-center justify-start gap-2 mt-5">
                          <label htmlFor="">Kiemelt legyen?</label>
                          <input
                            type="checkbox"
                            checked={item.outlined}
                            onChange={(e) => {
                              const newPostItems = data.postItems?.map(
                                (postItem, idx) => {
                                  if (index === idx) {
                                    return {
                                      ...postItem,
                                      outlined: e.target.checked,
                                    };
                                  }
                                  return postItem;
                                }
                              );

                              if (newPostItems) {
                                setData({ ...data, postItems: newPostItems });
                              }
                            }}
                          />
                        </div>
                        <DeleteIcon
                          onClick={() => deleteItem(item.id)}
                          className="absolute top-3 right-3 text-red-500 z-20 cursor-pointer"
                        />
                      </div>
                    );
                    break;
                }
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPostComponent;
