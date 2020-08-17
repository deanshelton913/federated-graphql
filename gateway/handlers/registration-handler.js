const { gateway, defaultService } = require('../gatewaySingleton');
const { apolloServer } = require('../apollo-server');
const { asyncHandler } = require('../../shared/async-handler');
const { registerOrFail } = require('../data-access');

const registrationHandler = asyncHandler((async (req, res) => {
    const { name, url } = req.body;
    const registeredServices = await registerOrFail({ name, url });
    console.log("Start reloading GraphQL schema...", registeredServices);
    const serviceList = [defaultService, ...registeredServices];
    gateway.config.serviceList = serviceList;
    await gateway.loadServiceDefinitions({serviceList});
    await gateway.load();
    console.log("Completed reloading GraphQL schema");
    return res.status(200).json({ ok: "true" });
}));

module.exports = { registrationHandler };
