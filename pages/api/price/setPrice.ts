import { connectToDatabase } from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ message: "Invalid or missing data" });
    }

    try {
        const client = await connectToDatabase();
        const db = client.db();
        const prices = db.collection("prices");

        const insertResult = await prices.insertMany(data);

        if (!insertResult.acknowledged) {
            throw new Error('Failed to insert prices');
        }

        return res.status(200).json({ message: "Prices set", insertedCount: insertResult.insertedCount });
    } catch (error) {
        console.error('Error inserting prices:', error);
        return res.status(500).json({ message: "Server error" });
    }
};

export default handler;
