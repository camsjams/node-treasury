'use strict';

var RedisClientAdapter = require('./adapters/redis');
var MemcachedClientAdapter = require('./adapters/memcached');
var MemoryClientAdapter = require('./adapters/memory');

const TYPE_REDIS = 'RedisClient';
const TYPE_MEMCACHED = 'Client';

function isValidClient(client) {
	return client === null || client && client.constructor;
}

function getClientAdapter(unknownClient, promiseFactory) {
	if (!isValidClient(unknownClient)) {
		throw new Error('invalid_client');
	} else if (unknownClient === null) {
		return new MemoryClientAdapter(unknownClient, promiseFactory);
	}

	var constructorName = unknownClient.constructor.name;
	var clientAdapter;

	switch (constructorName) {
		case TYPE_REDIS:
			clientAdapter = new RedisClientAdapter(unknownClient, promiseFactory);
			break;
		case TYPE_MEMCACHED:
			clientAdapter = new MemcachedClientAdapter(unknownClient, promiseFactory);
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
