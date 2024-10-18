import { PriceItem } from "@/types/mainTypes";

export const getPrices = async (): Promise<PriceItem[]> => {
    const response = await fetch("/api/price/getPrices");
    const prices = await response.json();
    return prices;
}

export const updatePrices = async (data: PriceItem[]): Promise<PriceItem[]> => {
    const response = await fetch("/api/price/updatePrices", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }), // Pass the whole array directly
    });

    if (!response.ok) {
        throw new Error("Failed to update prices");
    }

    const updatedPrices = await response.json();
    return updatedPrices;
};
