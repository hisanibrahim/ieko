import express, { json } from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { readFileSync } from "fs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

const typeDefs = readFileSync("src/schema.graphql", { encoding: "utf-8" });

const users = [
  {
    id: 1,
    name: "John Wick",
  },
  {
    id: 2,
    name: "Niki Lauda",
  },
];

type User = {
  id: Number;
  name: String;
};

const resolvers = {
  Query: {
    users: () => users,
  },
  Mutation: {
    updateUser: (parent: User, args: User) =>
      users[users.findIndex((user) => args.id === user.id)],
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use("/graphql", cors(), json(), expressMiddleware(server));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
