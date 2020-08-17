const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
  type Query {
    appleUser: User
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    coldApples: String
  }
`;

const resolvers = {
  Query: {
    appleUser(_user) {
      const fakeUser = { id: 123 };
      return { coldApples: 'brr! Cold apples.', ...fakeUser};
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(3000).then(({ url }) => {
  console.log(`🍎 Apple-Service ready`);
});
