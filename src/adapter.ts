import RedisClientAdapter from './adapters/redis';
import MemcachedClientAdapter from './adapters/memcached';
import MemoryClientAdapter from './adapters/memory';

const TYPE_REDIS = 'RedisClient';
const TYPE_MEMCACHED = 'Client';

const isValidClient = (client: unknown): boolean =>
	client === null || client && client.constructor !== undefined;

function getClientAdapter(unknownClient: TreasuryClient): TreasuryAdapter {
	if (!isValidClient(unknownClient)) {
		throw new Error('invalid_client');
	} else if (unknownClient === null) {
		return new MemoryClientAdapter(unknownClient);
	}

	const constructorName = unknownClient.constructor.name;
	if (constructorName === TYPE_REDIS) {
		return new RedisClientAdapter(unknownClient);
	} else if (constructorName === TYPE_MEMCACHED) {
		return new MemcachedClientAdapter(unknownClient);
	}

	throw new Error('unknown_client');
}

export default getClientAdapter;
