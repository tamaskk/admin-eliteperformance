import { connectToDatabase } from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let client;

    try {
        // Allow only GET requests
        if (req.method !== "GET") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }

        // Connect to the database
        client = await connectToDatabase();
        const db = client.db();
        const blogsCollection = db.collection("blogs");

        // Fetch blogs and process them
        const blogs = await blogsCollection.find({}).toArray();

        const processedBlogs = blogs.map((blog) => {
            return {
                ...blog,
                id: blog._id.toString(),
                _id: undefined,  // Optional, to hide the original _id field
                postItems: undefined,
                createdAt: undefined,
                updatedAt: undefined
            };
        });

        // Send the processed blogs data
        res.status(200).json({ data: processedBlogs });

    } catch (error: any) {
        // Error handling
        res.status(500).json({ message: "Internal server error", error: error.message });
    } finally {
        // Ensure the client is closed
        if (client) {
            await client.close();
        }
    }
};

export default handler;
