import { connectToDatabase } from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";
import * as xlsx from "xlsx";  // Import xlsx package

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    let client;

    try {
        client = await connectToDatabase();
        const db = client.db();
        const newsletterEmailCollection = db.collection("newsLetterEmails");

        // Fetch the data from the collection
        const newsletterEmails = await newsletterEmailCollection.find({}).toArray();

        // Array with only object which includes emails
        const emailList = newsletterEmails.map(email => email.email);


        console.log(emailList)

        // Convert MongoDB documents to JSON structure
        const worksheet = xlsx.utils.json_to_sheet(emailList);
    
        // Create a new workbook and append the worksheet
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate a buffer for the workbook (binary format)
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        // Set headers for file download
        res.setHeader("Content-Disposition", "attachment; filename=newsletter-emails.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        // Send the buffer as the response
        res.status(200).send(excelBuffer);
    } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        if (client) {
            await client.close();
        }
    }
};

export default handler;
