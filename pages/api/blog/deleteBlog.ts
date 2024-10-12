import { connectToDatabase } from "@/db/db";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== "DELETE") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    let client;

    try {
        const { id } = req.query;

        // Delete the blog with the id

        client = await connectToDatabase();

        const db = client.db();

        const blogsCollection = db.collection("blogs");

        const objectid = ObjectId.createFromHexString(id as string);

        const result = await blogsCollection.deleteOne({ _id: objectid });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog deleted" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        if (client) {
            client.close();
        }
    }

};

export default handler;