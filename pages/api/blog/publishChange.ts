import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../db/db';
import { ObjectId } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { isItPublished, id } = req.body;

    // Validate the request data
    if (!id || typeof isItPublished !== 'boolean') {
        return res.status(400).json({ message: "Invalid data", id, isItPublished });
    }

    let client;

    try {
        client = await connectToDatabase();
        const db = client.db();
        const blogsCollection = db.collection("blogs");

        // Convert string ID to ObjectId from the request
        const objectId = ObjectId.createFromHexString(id);

        // Check if the blog exists
        const findResult = await blogsCollection.findOne({ _id: objectId });
        if (!findResult) {
            return res.status(404).json({ message: "Blog not found", objectId });
        }

        if (!isItPublished) {
            const updateResult = await blogsCollection.findOneAndUpdate(
                { _id: objectId },
                { $set: { isPublished: true } },
                        );

                        res.status(200).json({
                            message: "Blog updated",
                            updatedCount: updateResult && updateResult.ok === 1 ? 1 : 0
                        });
        }
        else {
            const updateResult = await blogsCollection.findOneAndUpdate(
                { _id: objectId },
                { $set: { isPublished: false } },
                        );

                        res.status(200).json({
                            message: "Blog updated",
                            updatedCount: updateResult && updateResult.ok === 1 ? 1 : 0
                        });
        }

        // Update the blog's `isPublished` status

        // Check if the updateResult is null
        // if (updateResult && !updateResult.value) {
        //     return res.status(404).json({ message: "Blog not found or no changes made" });
        // }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error });
    } finally {
        if (client) {
            client.close();
        }
    }
};

export default handler;
