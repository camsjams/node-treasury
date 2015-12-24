'use strict';

var RedisClientAdapter = require('./adapters/redis');
var MemcachedClientAdapter = require('./adapters/memcached');
var MemoryClientAdapter = require('./adapters/memory');

const TYPE_MEMORY = 'MemoryClientAdapter';
const TYPE_REDIS = 'RedisClient';
const TYPE_MEMCACHED = 'Client';

function getClientAdapter(unknownClient) {
    if (!unknownClient || !unknownClient.constructor) {
        throw new Error('invalid_client');
    }
    var constructorName = unknownClient.constructor.name;
    var clientAdapter;

    switch (constructorName) {
        case TYPE_MEMORY:
            clientAdapter = unknownClient;
            break;
        case TYPE_REDIS:
            clientAdapter = new MemcachedClientAdapter(unknownClient);
            break;
        case TYPE_MEMCACHED:
            clientAdapter = new RedisClientAdapter(unknownClient);
            break;
        default:
            throw new Error('unknown_client');
    }

    return clientAdapter;
}


module.exports = {
    RedisClientAdapter: RedisClientAdapter,
    MemcachedClientAdapter: MemcachedClientAdapter,
    MemoryClientAdapter: MemoryClientAdapter,
    getClientAdapter: getClientAdapter
};