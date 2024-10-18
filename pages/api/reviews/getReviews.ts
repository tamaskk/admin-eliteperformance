import { connectToDatabase } from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    let client;

    try {

        client = await connectToDatabase();

        const db = client.db();

        const reviews = await db.collection("reviews").find({}).toArray();

        return res.status(200).json(reviews);

    } catch (error) {
        return res.status(500).json({ message: "Failed to connect to database" });
    } finally {
        if (client) {
            await client.close();
        }
    }
};

export default handler;