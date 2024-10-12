import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/db/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, please use POST" });
  }

  const { userData } = req.body;

  if (!userData || !userData.email || !userData.password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { email, password } = userData;

  const client = await connectToDatabase();
  const db = client.db();
  const users = db.collection("admin");

  try {
    const isUserExist = await users.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({ email, password: hashedPassword });

    if (!result.acknowledged) {
      throw new Error("Could not register user");
    }

    res.status(201).json({ message: "Successfully registered!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  } finally {
    client?.close();
  }
};

export default handler;
