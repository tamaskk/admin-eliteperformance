import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../db/db';
import { ObjectId } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const data = req.body;

    // // Validate the request data (adjust the required fields accordingly)
    if (!data.title || !data.createdAt || !data.updatedAt) {
        return res.status(400).json({ message: "Invalid data" });
    }

    let client;

    try {
        client = await connectToDatabase();
        const db = client.db();
        const blogsCollection = db.collection("blogs");

        // Update the data with the required fields

        const { _id, ...updateData } = data;

        const result = await blogsCollection.updateOne(
            { _id: ObjectId.createFromHexString(_id) },
            { $set: { ...updateData } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }


        res.status(201).json({ message: "Blog created", data: { _id: result, ...data } });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        if (client) {
            client.close();
        }
    }
};

export default handler;