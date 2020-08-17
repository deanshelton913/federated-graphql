const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
  type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    username: String
  }
`;

async function fetchUserById (id) {
  // calls a DB or something.
  return { id, username: "whocares" }
}

const resolvers = {
  Query: {
    me() {
      return fetchUserById(1)
    }
  },
  User: {
    __resolveReference(user, { fetchUserById }){
      return fetchUserById(user.id)
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(3000).then(() => {
    console.log(`👤 User-Service ready.`);
});
