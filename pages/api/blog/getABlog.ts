import { connectToDatabase } from "@/db/db";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const data = req.body;

    // // Validate the request data (adjust the required fields accordingly)

    if (!data) {
        return res.status(400).json({ message: "Invalid data" });
    }

    let client;

    try {
        client = await connectToDatabase();
        const db = client.db();
        const blogsCollection = db.collection("blogs");

        const objectID = ObjectId.createFromHexString(data);

        const result = await blogsCollection.findOne({
            _id: objectID
        });

        if (!result) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ data: result });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        if (client) {
            client.close();
        }
    }

};

export default handler;