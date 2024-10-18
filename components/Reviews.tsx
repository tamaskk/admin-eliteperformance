import { addReview, getReviews, removeReview } from "@/services/reviewService";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import DeleteIcon from "@mui/icons-material/Delete";
import { storage } from "@/db/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "@firebase/storage";

const ReviewsComponent = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const getReviewsAll = async () => {
      try {
        const reviews = await getReviews();
        setReviews(reviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    getReviewsAll();
  }, []);

  const addReviewLocal = () => {
    const reviewItem = {
      name: "",
      review: "",
      imageUrl: "",
    };

    setReviews([...reviews, reviewItem]);
  };

  const uploadFile = (image: File | null, name: string) => {
    if (!image) {
      toast.error("Nem választottál képet!");
      return;
    }

    if (image.size > 10 * 1024 * 1024) {
      toast.error("A kép mérete túl nagy! Maximum 10MB lehet.");
      return;
    }

    if (!name) {
      toast.error("Elöszőr a név mezőt kell kitölteni!");
      return;
    }

    const imageRef = storageRef(storage, `reviews/${name}`);

    toast.loading("Kép feltöltése folyamatban...");

    uploadBytes(imageRef, image)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url: string) => {
            setReviews((prevReviews: any[]) => {
              return prevReviews.map((review) => {
                if (review.name === name) {
                  return { ...review, imageUrl: url };
                }
                return review;
              });
            });

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

  const saveReviews = async () => {
    try {
      const resp = await addReview(reviews);
      toast.success("Értékelések sikeresen frissítve!");
    } catch (error) {
      console.error("Failed to update reviews:", error);
    }
  };

  const deleteReview = async (name: string) => {
    const confirmDelete = window.confirm(
      "Biztosan törölni szeretnéd ezt az értékelést?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const resp = await removeReview(name);
      const newReviews = reviews.filter((review) => review.name !== name);
      setReviews(newReviews);
      toast.success("Értékelés sikeresen törölve!");
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Hiba történt az értékelés törlése közben");
    }
  };

  return (
    <div className="w-full h-screen max-h-screen overflow-y-auto bg-white text-black flex flex-col p-6 md:p-10">
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
      <div className="flex flex-row items-center justify-between mb-6">
        <h1 className="font-bold text-2xl md:text-3xl">Értékelések</h1>
        <div className="flex flex-row justify-center items-center gap-2">
          <button
            onClick={addReviewLocal}
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#000001] transition-all"
          >
            Értékelés hozzáadása
          </button>
          <button
            onClick={saveReviews}
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#000001] transition-all"
          >
            Mentés
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-8 w-full">
        {reviews.length !== 0 &&
          reviews.map((review, index) => (
            <div
              key={index}
              className={`w-full h-auto p-6 shadow-lg border border-gray-200 rounded-lg ${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              } flex flex-row items-start justify-between gap-4`}
            >
              <p className="font-semibold text-lg">{index + 1}.</p>
              <div className="flex-grow">
                <p>Név</p>
                <input
                  type="text"
                  placeholder="Név"
                  className="w-full p-2 mb-5 border border-gray-300 rounded-md"
                  value={review.name}
                  onChange={(e) => {
                    const newReviews = [...reviews];
                    newReviews[index].name = e.target.value;
                    setReviews(newReviews);
                  }}
                />
                <p>Értékelés</p>
                <textarea
                  rows={4}
                  placeholder="Értékelés"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={review.review}
                  onChange={(e) => {
                    const newReviews = [...reviews];
                    newReviews[index].review = e.target.value;
                    setReviews(newReviews);
                  }}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => {
                    const input = document.getElementById(
                      `imageInput-${index}`
                    );
                    input?.click();
                  }}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
                >
                  Kép feltöltése
                </button>
                {review.imageUrl && (
                  <img
                    src={review.imageUrl}
                    alt={review.name}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                  />
                )}
              </div>
              <input
                type="file"
                className="hidden"
                id={`imageInput-${index}`}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  uploadFile(file, review.name);
                }}
              />
              <button 
              onClick={() => deleteReview(review.name)}
              className="ml-4">
                <DeleteIcon className="text-red-500 hover:text-red-700 transition-colors duration-300" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReviewsComponent;
