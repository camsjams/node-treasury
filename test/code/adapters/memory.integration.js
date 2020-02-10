const chai = require('chai');
const adapters = require('../../../lib/adapters');
const _rewire = require('rewire');

const Treasury = _rewire('../../../index');
const promiseFactory = Treasury.__get__('nativePromise');

describe('Test memory client and adapter', testMemory);

function testMemory() {
	it('should return a memory client adapter', getMemoryAdapter);
	it('should reject when not found in cache', getDataFromEmpty);
	it('should set in cache', setData);
	it('should set then get from cache', setAndGetData);
	it('should set then get bad data from cache', setAndGetExpiredData);
	it('should delete from cache', deleteData);
	it('should delete from cache and not get later', deleteAndGetData);

	function getMemoryAdapter(done) {
		// arrange
		// act
		const result = adapters.getClientAdapter(null, promiseFactory);

		// assert
		chai.assert.typeOf(result, 'Object');
		chai.assert.typeOf(result.get, 'Function');
		chai.assert.typeOf(result.set, 'Function');
		chai.assert.typeOf(result.del, 'Function');
		chai.assert.typeOf(result.client, 'Null');
		chai.assert.equal(result.constructor.name, 'MemoryClientAdapter');
		chai.assert.typeOf(result.PromiseFactory, 'Function');
		chai.assert.deepEqual(result.PromiseFactory, promiseFactory);

		done();
	}

	function getDataFromEmpty() {
		// arrange
		const memoryAdapter = adapters.getClientAdapter(null, promiseFactory);

		// act
		return memoryAdapter.get('newKey')

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
		const memoryAdapter = adapters.getClientAdapter(null, promiseFactory);

		// act
		return memoryAdapter.set('aCoolKey', {a: true}, 10)
			.then((result) => {
				// assert
				chai.assert.ok(result);
			});
	}

	function setAndGetData() {
		// arrange
		const memoryAdapter = adapters.getClientAdapter(null, promiseFactory);
		const cacheKey = 'hasA';

		// act
		return memoryAdapter.set(cacheKey, {a: true}, 10)
			.then(memoryAdapter.get.bind(memoryAdapter, cacheKey))
			.then((result) => {
				// assert
				chai.assert.typeOf(result, 'Object');
				chai.assert.equal(result.a, true);
			});
	}

	function setAndGetExpiredData() {
		// arrange
		const memoryAdapter = adapters.getClientAdapter(null, promiseFactory);
		const cacheKey = 'hasA';

		// act
		return memoryAdapter.set(cacheKey, {a: true}, 1)
			.then(waitPromise)
			.then(memoryAdapter.get.bind(memoryAdapter, cacheKey))

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
		const memoryAdapter = adapters.getClientAdapter(null, promiseFactory);
		const cacheKey = 'numberOfCats';

		// act
		return memoryAdapter.set(cacheKey, 101, 100)
			.then(memoryAdapter.del.bind(memoryAdapter, cacheKey))
			.then((result) => {
				chai.assert.ok(result);
			});
	}

	function deleteAndGetData() {
		// arrange
		const memoryAdapter = adapters.getClientAdapter(null, promiseFactory);
		const cacheKey = 'numberOfCats';

		// act
		return memoryAdapter.set(cacheKey, 101, 100)
			.then(memoryAdapter.del.bind(memoryAdapter, cacheKey))
			.then(memoryAdapter.get.bind(memoryAdapter, cacheKey))

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
		}, 300);
	});
}
