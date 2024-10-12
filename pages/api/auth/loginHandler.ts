import { NextApiRequest, NextApiResponse } from "next/types";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/db/db";
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userData } = req.body;

    const { email, password } = userData;

    // Check if the email exists in the database

    const client = await connectToDatabase();

    const db = client.db();

    const users = db.collection("admin");

    const user = await users.findOne({ email: email });

    if (!user) {
        client?.close();
        return res.status(400).json({ error: "User does not exist" });
    }

    // Compare the hashed password with the stored password

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        client?.close();
        return res.status(400).json({ error: "Invalid password" });
    }

    const token = await getToken({ req });
    
    client?.close();
    res.status(200).json({ message: "Successfully logged in!", user: user, token: token, firstName: user.firstName });
};

export default handler;
