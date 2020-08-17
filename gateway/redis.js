const { createClient } = require('redis');
const { REDIS_HOST } = process.env;
const { promisify } = require('util');
const singletonRedis = createClient({ host: REDIS_HOST || 'localhost' });

singletonRedis.on('error', function (err) {
    console.log('could not establish a connection with redis. ' + err);
});

singletonRedis.on('connect', function (err) {
    console.log('connected to redis successfully');
});

const REGISTRATION_SET = `gateway:registrations`;
const SERVICES_LIST = `gateway:serviceList`;

// redis stuff
const sismember = promisify(singletonRedis.sismember).bind(singletonRedis);
const sadd = promisify(singletonRedis.sadd).bind(singletonRedis);
const rpush = promisify(singletonRedis.rpush).bind(singletonRedis);
const lrange = promisify(singletonRedis.lrange).bind(singletonRedis);

module.exports = {
    REGISTRATION_SET,
    SERVICES_LIST,
    client: {
        sismember,
        sadd,
        rpush,
        lrange
    }
}
