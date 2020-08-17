const { client, SERVICES_LIST, REGISTRATION_SET } = require('./redis');
const { FailureByDesign } = require('../shared/failure-by-design');

const isAlreadyRegistered = async (name) => {
    return client.sismember(REGISTRATION_SET, name);
}

const normalize = (str) => str.toLowerCase(); // meh.

const registerOrFail = async ({ name: dirtyName, url }) => {
    const name = normalize(dirtyName);
    const isRegistered = await isAlreadyRegistered(name);
    if (isRegistered) throw new FailureByDesign('CONFLICT', `${name} is already registered.`);
    await client.rpush(SERVICES_LIST, JSON.stringify({ name, url }));
    const serviceList = await client.lrange(SERVICES_LIST, 0, -1);
    await client.sadd(REGISTRATION_SET, name);
    return serviceList.map(x => JSON.parse(x));
}

const getServiceList = () => {
    return client.lrange(SERVICES_LIST, 0, -1);
}

module.exports = {
    registerOrFail,
    getServiceList
}
