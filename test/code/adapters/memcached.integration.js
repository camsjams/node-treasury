var chai = require('chai');
var adapters = require('../../../lib/adapters');
var Memcached = require('memcached');
var _rewire = require('rewire');
var Treasury = _rewire('../../../index');
var promiseFactory = Treasury.__get__('nativePromise');

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
		var memcached = new Memcached();

		// act
		var result = adapters.getClientAdapter(memcached, promiseFactory);

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
		var client = new Memcached();
		var memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);

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
		var client = new Memcached();
		var memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);

		// act
		return memcachedAdapter.set('aCoolKey', {a: true}, 10)
			.then((result) => {
				// assert
				chai.assert.ok(result);
			});
	}

	function setAndGetData() {
		// arrange
		var client = new Memcached();
		var memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);
		var cacheKey = 'setAndGetData';

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
		var client = new Memcached();
		var memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);
		var cacheKey = 'setAndGetExpiredData';

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
		var client = new Memcached();
		var memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);
		var cacheKey = 'numberOfCats_deleteData';

		// act
		return memcachedAdapter.set(cacheKey, 101, 100)
			.then(memcachedAdapter.del.bind(memcachedAdapter, cacheKey))
			.then((result) => {
				chai.assert.ok(result);
			});
	}

	function deleteAndGetData() {
		// arrange
		var client = new Memcached();
		var memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);
		var cacheKey = 'numberOfCats_deleteAndGetData';

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
