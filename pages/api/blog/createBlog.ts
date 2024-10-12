import { connectToDatabase } from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

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

      const result = await blogsCollection.insertOne(data);
      res.status(201).json({ message: "Blog created", data: "asd" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    } finally {
      if (client) {
      client.close();
      }
    }

    res.status(201).json({ data });
  };
  
export default handler;