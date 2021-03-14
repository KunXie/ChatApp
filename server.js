const { ApolloServer } = require("apollo-server");

const { sequelize } = require("./models/");

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers, context: (ctx) => ctx });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);

  sequelize
    .authenticate()
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));
});
