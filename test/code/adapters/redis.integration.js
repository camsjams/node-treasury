const chai = require('chai');
const adapters = require('../../../lib/adapters');
const redis = require('redis');
const _rewire = require('rewire');

const Treasury = _rewire('../../../index');
const promiseFactory = Treasury.__get__('nativePromise');

describe('Test redis client and adapter', testRedis);

function testRedis() {
	it('should return a redis client adapter', getRedisAdapter);
	it('should reject when not found in cache', getDataFromEmpty);
	it('should set in cache', setData);
	it('should set then get from cache', setAndGetData);
	it('should set then get bad data from cache', setAndGetExpiredData);
	it('should delete from cache', deleteData);
	it('should delete from cache and not get later', deleteAndGetData);

	function getRedisAdapter(done) {
		// arrange
		const client = redis.createClient();

		// act
		const result = adapters.getClientAdapter(client, promiseFactory);

		// assert
		chai.assert.typeOf(result, 'Object');
		chai.assert.typeOf(result.get, 'Function');
		chai.assert.typeOf(result.set, 'Function');
		chai.assert.typeOf(result.del, 'Function');
		chai.assert.deepEqual(result.client, client);
		chai.assert.equal(result.constructor.name, 'RedisClientAdapter');
		chai.assert.typeOf(result.PromiseFactory, 'Function');
		chai.assert.deepEqual(result.PromiseFactory, promiseFactory);

		done();
	}

	function getDataFromEmpty() {
		// arrange
		const client = redis.createClient();
		const redisAdapter = adapters.getClientAdapter(client, promiseFactory);

		// act
		return redisAdapter.get('newKey')

			// assert
			.then(() => {
				throw new Error('resolved but should be rejected!');
			})
			.catch((error) => {
				chai.assert.typeOf(error, 'Null');
			});
	}

	function setData() {
		// arrange
		const client = redis.createClient();
		const redisAdapter = adapters.getClientAdapter(client, promiseFactory);

		// act
		return redisAdapter.set('aCoolKey', {a: true}, 10)
			.then((result) => {
				// assert
				chai.assert.ok(result);
			});
	}

	function setAndGetData() {
		// arrange
		const client = redis.createClient();
		const redisAdapter = adapters.getClientAdapter(client, promiseFactory);
		const cacheKey = 'setAndGetData';

		// act
		return redisAdapter.set(cacheKey, {a: true}, 15)
			.then(redisAdapter.get.bind(redisAdapter, cacheKey))
			.then((result) => {
				// assert
				chai.assert.typeOf(result, 'Object');
				chai.assert.equal(result.a, true);
			});
	}

	function setAndGetExpiredData() {
		// arrange
		const client = redis.createClient();
		const redisAdapter = adapters.getClientAdapter(client, promiseFactory);
		const cacheKey = 'setAndGetExpiredData';

		// act
		return redisAdapter.set(cacheKey, {a: true}, 1)
			.then(waitPromise)
			.then(redisAdapter.get.bind(redisAdapter, cacheKey))

			// assert
			.then(() => {
				throw new Error('resolved but should be rejected!');
			})
			.catch((error) => {
				chai.assert.typeOf(error, 'Null');
			});
	}

	function deleteData() {
		// arrange
		const client = redis.createClient();
		const redisAdapter = adapters.getClientAdapter(client, promiseFactory);
		const cacheKey = 'numberOfCats:deleteData';

		// act
		return redisAdapter.set(cacheKey, 101, 100)
			.then(redisAdapter.del.bind(redisAdapter, cacheKey))
			.then((result) => {
				chai.assert.ok(result);
			});
	}

	function deleteAndGetData() {
		// arrange
		const client = redis.createClient();
		const redisAdapter = adapters.getClientAdapter(client, promiseFactory);
		const cacheKey = 'numberOfCats:deleteAndGetData';

		// act
		return redisAdapter.set(cacheKey, 101, 100)
			.then(redisAdapter.del.bind(redisAdapter, cacheKey))
			.then(redisAdapter.get.bind(redisAdapter, cacheKey))

			// assert
			.then(() => {
				throw new Error('resolved but should be rejected!');
			})
			.catch((error) => {
				chai.assert.typeOf(error, 'Null');
			});
	}
}

function waitPromise() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, 1000);
	});
}
