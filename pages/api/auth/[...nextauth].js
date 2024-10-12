import { connectToDatabase } from "../../../db/db";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const SECRET_KEY = "272fd023a34ee92358d08b30846c304394a1dc48ece83d064b6c5153809e7e4a\n" +
"c1daf008a69c4a1b975da03dc4df5c12d2781589c29bffb6351e61bd65318689\n" +
"03036ffe5c358ee9f5acd8b4c91dfc8e203f05dca2fd8a4ef19ead50d873203e\n" +
"b7ec0a78b595b896c9ff9390b8f7e3284349a007f6b0e2c9445aa1c3d27c968c\n" +
"fba40fca4b16a43c178ebc2f75362ea30a81c801a916cbb1ec8081eeab00bf81\n" +
"456bbc4d85982221f69a116f2eaf4c104f16d87ba646c6c66ca3f1e0d5679514\n" +
"852170ea6653c5cb6e81b99aacc0bd5ee83eb2e5a7cf94e27d3f2b6746304f55\n" +
"45d88dc3d6c68cf5abefbf66a41572f17c9bcd4d299607682980f720cc48d089\n" +
"581d3b1b616a0a5c7d738e528e21f8c6bc5d4787109566db01a883d32bfec22c\n" +
"a5a77419e4e4db32ca8487f5050785183b3602610df43e8d19c92180d8212461";

const authOptions = {
  session: {
    // strategy: "jwt",
    jwt: true
  },
  secret: SECRET_KEY,
  providers: [
    CredentialsProvider({
      name: "credentials",
      authorize: async (credentials) => {
        let client;
        try {
          client = await connectToDatabase();
          const usersCollection = client.db().collection("users");
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

          // Close the client connection before returning
          client.close();

          // Return necessary data for JWT token
          return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user._id,
          };
        } catch (error) {
          // Close the client connection in case of an error
          if (client) client.close();
          throw new Error(error.message);
        }
      },
      credentials: {
        email: {},
        password: {},
      },
      pages: {
        signIn: "/login",
      },
    }),
  ],
};

export default NextAuth(authOptions);
