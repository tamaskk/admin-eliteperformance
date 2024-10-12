import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { BlogPost, PostItems } from "@/types/blogTypes";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "@firebase/storage";
import { storage } from "../db/firebase";
import { createBlogItem, getABlog, updateBlogItem } from "@/services/blogService";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const EditPostComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BlogPost>({
    title: "",
    header: "",
    coverImage: "",
    category: "",
    createdAt: "",
    id: "",
    postItems: [], // Use an empty array here
    updatedAt: "",
  });
  const [selectedType, setSelectedType] = useState<string>("");
  const firstRender = useRef(true);

  const [dragActive, setDragActive] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  useEffect(() => {
    const id = router.query.id;
    if (id) {
        const fetchBlog = async () => {
            try {
              setLoading(true);
                const blog = await getABlog(id as string);
                setData(blog.data);
                console.log(blog.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch blog:", error);
                setLoading(false);
            }
        }

        if (firstRender.current) {
            firstRender.current = false;
        } else {
            fetchBlog();
        }
    }
  }, [router.pathname]);

  // const createBlogItemButton = async () => {
  //   setData({
  //     title: "Cím",
  //     header: "Fejléc",
  //     coverImage: "https://firebasestorage.googleapis.com/v0/b/eliteperformance-6fc5c.appspot.com/o/asd%2F605NXvUwnwKWu?alt=media&token=627dae89-542d-465a-88bc-c8cfa65bd4d7",
  //     createdAt: new Date().toISOString(),
  //     id: "",
  //     postItems: [
  //       {
  //         type: "title",
  //         title: "Cím",
  //         id: "1",

  //       },
  //       {
  //         type: "subTitle",
  //         subTitle: "Alcím",
  //         id: "2",
  //       },
  //       {
  //         type: "paragraph",
  //         paragraph: "Szöveg",
  //         id: "3",
  //       },
  //       {
  //         type: "image",
  //         imageUrl: "https://firebasestorage.googleapis.com/v0/b/eliteperformance-6fc5c.appspot.com/o/asd%2F605NXvUwnwKWu?alt=media&token=627dae89-542d-465a-88bc-c8cfa65bd4d7",
  //         id: "4",
  //       },
  //       {
  //         type: "video",
  //         video: "Videó",
  //         id: "5",
  //       },
  //       {
  //         type: "list",
  //         list: ["Lista elem"],
  //         id: "6",
  //       },
  //       {
  //         type: "link",
  //         link: "Link",
  //         id: "7",
  //       }
  //     ],
  //     updatedAt: new Date().toISOString(),
  //   });
  // }

  useEffect(() => {
    console.log(data);
  }, [data]);

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
      alert("Blog sikeresen frissítve!");
      setData({
        title: "",
        header: "",
        coverImage: "",
        createdAt: "",
        id: "",
        category: "",
        postItems: [],
        updatedAt: "",
      });
      router.replace('/blog-posts')
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Unknown error occurred");
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
              alert(error.message);
            } else {
                toast.error("Ismeretlen hiba történt.");
            }
          });
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          alert(error.message);
            toast.error(error.message);
        } else {
          alert("Ismeretlen hiba történt.");
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
    const confirm = window.confirm("Biztosan törölni szeretnéd a képet?");
    if (confirm) {
      setData({ ...data, coverImage: "" });
    }
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
    const confirm = window.confirm("Biztosan törölni szeretnéd ezt az elemet?");
    if (confirm) {
      const newPostItems =
        data.postItems?.filter((postItem: PostItems) => postItem.id !== id) ||
        null;
      setData({ ...data, postItems: newPostItems });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedType(value);
    addBlogItem(value);
  };

  return (
    <div className="text-black bg-white h-screen min-h-screen p-10 w-full overflow-y-auto">
      <div className="flex flex-row items-center justify-between mb-5">
        <h1 className="font-bold text-3xl">Új poszt</h1>
        <button
          onClick={() => createBlog()}
          className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#000001]"
        >
          Mentés
        </button>
        <button 
        // onClick={createBlogItemButton}
        >
          kitöltés
        </button>
      </div>
      {
          loading && (
            <div className="w-full h-screen flex justify-center items-center">
              <p className="text-2xl text-black">Betöltés...</p>
            </div>
          )
        }
        {
          !loading && (
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
                            alert("Először add meg a blog címét!");
                            return;
                          }

                          if (!e.target.files || e.target.files.length === 0) {
                            alert("Nem választottál képet!");
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
          )
}
    </div>
  );
};

export default EditPostComponent;
