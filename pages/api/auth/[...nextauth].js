import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/db/db";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY; // Use a secret key for token signing
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // JWT secret for signing tokens

const authOptions = {
  session: {
    strategy: "jwt",
    jwt: true,
  },
  secret: SECRET_KEY,
  providers: [
    CredentialsProvider({
      name: "credentials",
      authorize: async (credentials) => {
        let client;
        try {
          client = await connectToDatabase();
          const usersCollection = client.db().collection("admin");
          const user = await usersCollection.findOne({
            email: credentials.email,
          });

          if (!user) {
            throw new Error("No user found with that email address!");
          }

          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid password! Please try again.");
          }

          client?.close();

          // Generate an access token
          const accessToken = jwt.sign(
            {
              id: user._id,
              email: user.email,
            },
            JWT_SECRET, // Sign the token with your secret key
            { expiresIn: '1h' } // Optional: set token expiration time
          );

          // Return necessary data for JWT token
          return {
            email: user.email,
            id: user._id,
            accessToken, // Include the generated access token
          };
        } catch (error) {
          if (client) client?.close();
          throw new Error(error.message);
        }
      },
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken; // Include accessToken in the JWT token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.accessToken = token.accessToken; // Pass accessToken to the session
      return session;
    },
  },
  
};

export default NextAuth(authOptions);
