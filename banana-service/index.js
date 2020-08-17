const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
  type Query {
    bananaUser: User
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    hotBanana: String
  }
`;

const resolvers = {
  Query: {
    bananaUser(_user) {
      const fakeUser = { id: 123 };
      return { hotBanana: 'oh yeah.', ...fakeUser};
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(3000).then(({ url }) => {
  console.log(`🍌 Banana-Service ready`);
});
