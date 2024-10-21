import { connectToDatabase } from "@/db/db";
import { BlogPost } from "@/types/blogTypes"; // Make sure BlogPost has the isPublished property
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

        // Fetch blogs from the database
        const blogs = await blogsCollection.find({}).toArray();

        // Process the blogs and include the isPublished field
        const processedBlogs = blogs.map((blog) => {
            return {
                ...blog,
                id: blog._id.toString(),
                isPublished: blog.isPublished,  // Ensure isPublished is included
                _id: undefined,  // Optional, to hide the original _id field
                postItems: undefined,
                createdAt: undefined,
                updatedAt: undefined
            };
        });

        // Filter the blogs that are published
        // Send the published blogs data
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
