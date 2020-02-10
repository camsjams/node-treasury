const chai = require('chai');
const adapters = require('../../../lib/adapters');
const Memcached = require('memcached');
const _rewire = require('rewire');

const Treasury = _rewire('../../../index');
const promiseFactory = Treasury.__get__('nativePromise');

describe('Test Memcached client and adapter', testMemcached);

function testMemcached() {
	it('should return a memcached client adapter', getMemcachedAdapter);
	it('should reject when not found in cache', getDataFromEmpty);
	it('should set in cache', setData);
	it('should set then get from cache', setAndGetData);
	it('should set then get bad data from cache', setAndGetExpiredData);
	it('should delete from cache', deleteData);
	it('should delete from cache and not get later', deleteAndGetData);

	function getMemcachedAdapter(done) {
		// arrange
		const memcached = new Memcached();

		// act
		const result = adapters.getClientAdapter(memcached, promiseFactory);

		// assert
		chai.assert.typeOf(result, 'Object');
		chai.assert.typeOf(result.get, 'Function');
		chai.assert.typeOf(result.set, 'Function');
		chai.assert.typeOf(result.del, 'Function');
		chai.assert.deepEqual(result.client, memcached);
		chai.assert.equal(result.constructor.name, 'MemcachedClientAdapter');
		chai.assert.typeOf(result.PromiseFactory, 'Function');
		chai.assert.deepEqual(result.PromiseFactory, promiseFactory);

		done();
	}

	function getDataFromEmpty() {
		// arrange
		const client = new Memcached();
		const memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);

		// act
		return memcachedAdapter.get('newKey')

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
		const client = new Memcached();
		const memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);

		// act
		return memcachedAdapter.set('aCoolKey', {a: true}, 10)
			.then((result) => {
				// assert
				chai.assert.ok(result);
			});
	}

	function setAndGetData() {
		// arrange
		const client = new Memcached();
		const memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);
		const cacheKey = 'setAndGetData';

		// act
		return memcachedAdapter.set(cacheKey, {a: true}, 10)
			.then(memcachedAdapter.get.bind(memcachedAdapter, cacheKey))
			.then((result) => {
				// assert
				chai.assert.typeOf(result, 'Object');
				chai.assert.equal(result.a, true);
			});
	}

	function setAndGetExpiredData() {
		// arrange
		const client = new Memcached();
		const memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);
		const cacheKey = 'setAndGetExpiredData';

		// act
		return memcachedAdapter.set(cacheKey, {a: true}, 1)
			.then(waitPromise)
			.then(memcachedAdapter.get.bind(memcachedAdapter, cacheKey))

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
		const client = new Memcached();
		const memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);
		const cacheKey = 'numberOfCats_deleteData';

		// act
		return memcachedAdapter.set(cacheKey, 101, 100)
			.then(memcachedAdapter.del.bind(memcachedAdapter, cacheKey))
			.then((result) => {
				chai.assert.ok(result);
			});
	}

	function deleteAndGetData() {
		// arrange
		const client = new Memcached();
		const memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);
		const cacheKey = 'numberOfCats_deleteAndGetData';

		// act
		return memcachedAdapter.set(cacheKey, 101, 100)
			.then(memcachedAdapter.del.bind(memcachedAdapter, cacheKey))
			.then(memcachedAdapter.get.bind(memcachedAdapter, cacheKey))

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
