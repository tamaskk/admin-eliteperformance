import { connectToDatabase } from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    // Fetch the newsletter email from the database

    let client;

    try {
        client = await connectToDatabase();

        const db = client.db();

        const newsletterEmailCollection = db.collection("newsLetterEmails");

        const newsletterEmail = await newsletterEmailCollection.find({}).toArray();

        res.status(200).json({ data: newsletterEmail });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        if (client) {
            client.close();
        }
    }

}; 

export default handler;