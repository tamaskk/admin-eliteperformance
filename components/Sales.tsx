import { getPrices, updatePrices } from "@/services/mainService";
import { PriceItem } from "@/types/mainTypes";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

const SalesComponent = () => {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const blogsResponse = await getPrices();
      setPrices(blogsResponse);
      console.log(blogsResponse);
    } catch (error) {
      console.error("Failed to fetch prices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "loading" && session) {
      fetchPrices();
    }
  }, [status, session]);

  const savePrices = async () => {
    try {
      const response = await updatePrices(prices);
      toast.success("Árak sikeresen frissítve!");
    } catch (error) {
      toast.error("Hiba történt az árak frissítése közben");
      console.error("Failed to update prices:", error);
    } finally {
      setLoading(false);
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
        <h1 className="font-bold text-2xl md:text-3xl">Árak</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#000001] transition-all"
          onClick={savePrices}
        >
          Mentés
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <p className="hidden sm:block font-bold">Név</p>
        <p className="hidden sm:block font-bold">Ár</p>
        <p className="hidden sm:block font-bold">Időtartam (Nem szükséges)</p>
        <p className="hidden sm:block font-bold">Akció</p>
      </div>

      {prices.map((price: PriceItem) => (
        <div
          key={price._id}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center mb-4 border-b pb-4"
        >
          <p className="font-semibold">{price.name}</p>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md"
            value={price.price}
            onChange={(e) =>
              setPrices(
                prices.map((item) =>
                  item._id === price._id
                    ? { ...item, price: e.target.value }
                    : item
                )
              )
            }
          />
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md"
            value={price.duration || ""}
            onChange={(e) =>
              setPrices(
                prices.map((item) =>
                  item._id === price._id
                    ? { ...item, duration: e.target.value }
                    : item
                )
              )
            }
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={price.isOnSale}
              onChange={(e) =>
                setPrices(
                  prices.map((item) =>
                    item._id === price._id
                      ? { ...item, isOnSale: e.target.checked }
                      : item
                  )
                )
              }
            />
            {price.isOnSale && (
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
                value={price.salePrice || ""}
                onChange={(e) =>
                  setPrices(
                    prices.map((item) =>
                      item._id === price._id
                        ? { ...item, salePrice: e.target.value }
                        : item
                    )
                  )
                }
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalesComponent;
