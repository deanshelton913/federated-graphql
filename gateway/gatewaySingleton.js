const { ApolloGateway } = require('@apollo/gateway');
const { logger } = require('../shared/logger');
// const { getServiceList } = require('../gateway/data-access');
const { USER_SERVICE } = process.env;

// const registeredServicesasync = await getServiceList();
// console.log('registeredServices',registeredServices)
const defaultService = { name: "user", url: USER_SERVICE };
// { name: "banana-user", url: "http://banana-service:3000" }
const registeredServices = []; // this module must first be made async to pull from redis.
const serviceList = [defaultService, ...registeredServices];
const gateway = new ApolloGateway({ serviceList, logger });
console.log('making a new GATEWAY')

module.exports = { gateway, defaultService };
