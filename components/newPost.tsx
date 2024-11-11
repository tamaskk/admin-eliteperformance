import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { BlogPost, PostItems } from "@/types/blogTypes";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "@firebase/storage";
import { storage } from "../db/firebase";
import { createBlogItem } from "@/services/blogService";
import { Toaster, toast } from "sonner";
import { useSession } from "next-auth/react";
import Probaaa from "./probaaa";
import { useMainContext } from "@/context/mainContext";

const categories: Array<
  "edzés" | "versenyfelkészülés" | "regeneráció" | "étrend"
> = ["edzés", "versenyfelkészülés", "regeneráció", "étrend"];

const NewPostComponent = () => {
  const { data, setData } = useMainContext();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("");

  const [dragActive, setDragActive] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  const createBlog = async () => {
    console.log(data)
    toast.loading("Blog létrehozása folyamatban...");
    try {
      await createBlogItem(data);
      toast.success("Blog sikeresen létrehozva!");
      setData({
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
    } catch (error) {
      if (error instanceof Error) {
        toast.dismiss();
        toast.error("Hiba történt a blog létrehozása során");
      } else {
        toast.dismiss();
        toast.error("Ismeretlen hiba történt a blog létrehozása során");
      }
    } finally {
      toast.dismiss();
    }
  };

  const uploadFile = (image: File | null, id: string) => {
    if (data.title === "") {
      toast.error("Először add meg a blog címét!");
      return;
    }

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
    const confirm = window.confirm("Biztosan törölni szeretnéd a képet?");
    if (!confirm) return;
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
        <button
          onClick={() => createBlog()}
          className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#000001]"
        >
          Mentés
        </button>
      </div>
      <div className="flex flex-col sm:flex-col justify-start items-start w-full h-full mb-5 pb-5">
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
              ["edzés", "versenyfelkészülés", "regeneráció", "étrend"] as Array<
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
          <Probaaa setData={setData} data={data} />
        </div>
      </div>
    </div>
  );
};

export default NewPostComponent;
