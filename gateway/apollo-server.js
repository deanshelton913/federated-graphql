const { ApolloServer } = require('apollo-server-express');
const { gateway } = require('./gatewaySingleton');
const apolloServer = new ApolloServer({ gateway, subscriptions: false, });

module.exports = {
    apolloServer
}
