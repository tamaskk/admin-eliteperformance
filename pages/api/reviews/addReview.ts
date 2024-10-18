import { connectToDatabase } from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { reviews } = req.body;

    if (!reviews) {
        return res.status(400).json({ message: "Missing field(s)", reviews });
    }

    let client;

    try {

        client = await connectToDatabase();

        const db = client.db();

        const review = await db.collection("reviews").insertMany(reviews);

        return res.status(200).json(review);

    } catch (error) {
        return res.status(500).json({ message: "Failed to connect to database" });
    } finally {
        if (client) {
            await client.close();
        }
    }
};

export default handler;