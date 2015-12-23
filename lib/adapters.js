const TYPE_MEMORY = 'MemoryClientAdapter';
const TYPE_REDIS = 'RedisClient';
const TYPE_MEMCACHED = 'Client';

function getClientAdapter(unknownClient) {
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
            throw new Error('Unknown client!');
    }

    return clientAdapter;
}

function RedisClientAdapter(client) {

}

function MemcachedClientAdapter(client) {

}

function MemoryClientAdapter() {

}

module.exports = {
    getClientAdapter: getClientAdapter,
    RedisClientAdapter: RedisClientAdapter,
    MemcachedClientAdapter: MemcachedClientAdapter,
    MemoryClientAdapter: MemoryClientAdapter
};