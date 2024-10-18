import { connectToDatabase } from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ message: "Invalid data format. Expected an array of price items." });
    }

    let client;

    try {
        client = await connectToDatabase();
        const db = client.db();
        const pricesCollection = db.collection("reviews");

        // Prepare bulk operations, excluding `_id` in the $set part
        const bulkOps = data.map(item => {
            const { _id, ...rest } = item; // Destructure _id and exclude it from the update
            return {
                updateOne: {
                    filter: { _id: new ObjectId(_id) }, // Use `_id` only for filtering
                    update: { $set: rest },             // Do not include `_id` in the update
                    upsert: true                        // Insert if the document doesn't exist
                }
            };
        });

        // Execute bulk operations
        const result = await pricesCollection.bulkWrite(bulkOps);

        return res.status(200).json({
            message: "Prices updated",
            modifiedCount: result.modifiedCount,
            upsertedCount: result.upsertedCount,
            matchedCount: result.matchedCount
        });

    } catch (error) {
        console.error("Error updating prices:", error);
        return res.status(500).json({ message: "Failed to update prices", error });
    } finally {
        if (client) {
            await client.close();
        }
    }
};

export default handler;
