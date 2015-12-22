function getClientType() {
    /*console.log('redis',  require('redis').createClient().constructor.name);
    var memcached = require('memcached');
    console.log('memcached', new memcached().constructor.name);*/
}

function RedisClientAdapter() {

}

function MemcachedClientAdapter() {

}

function MemoryClientAdapter() {

}

module.exports = {
    getClientType: getClientType,
    RedisClientAdapter: RedisClientAdapter,
    MemcachedClientAdapter: MemcachedClientAdapter,
    MemoryClientAdapter: MemoryClientAdapter
};