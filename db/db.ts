import { MongoClient } from "mongodb";

export const connectToDatabase = async () => {
    const client = await MongoClient.connect(
      `mongodb+srv://dbUser:ptNUMmX1Yk5sZDii@cluster0.0zn2l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    );
    return client;
  };