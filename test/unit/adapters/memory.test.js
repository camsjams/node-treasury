var chai = require('chai');
var adapters = require('../../../lib/adapters');
var _rewire = require('rewire');
var Treasury = _rewire('../../../index');
var promiseFactory = Treasury.__get__('nativePromise');

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
        var result = adapters.getClientAdapter(null, promiseFactory);

        // assert
        chai.assert.typeOf(result, 'Object');
        chai.assert.typeOf(result.getData, 'Function');
        chai.assert.typeOf(result.setData, 'Function');
        chai.assert.typeOf(result.deleteData, 'Function');
        chai.assert.typeOf(result.client, 'Null');
        chai.assert.equal(result.constructor.name, 'MemoryClientAdapter');
        chai.assert.typeOf(result.promiseFactory, 'Function');
        chai.assert.deepEqual(result.promiseFactory, promiseFactory);

        done();
    }

    function getDataFromEmpty() {
        // arrange
        var memoryAdapter = adapters.getClientAdapter(null, promiseFactory);

        // act
        return memoryAdapter.getData('newKey')
            // assert
            .then(function() {
                throw new Error('resolved but should be rejected!');
            })
            .catch(function(error) {
                chai.assert.typeOf(error, 'Null');
            });
    }

    function setData() {
        // arrange
        var memoryAdapter = adapters.getClientAdapter(null, promiseFactory);

        // act
        return memoryAdapter.setData('aCoolKey', {a: true}, 10)
            .then(function(result) {
                // assert
                chai.assert.ok(result);
            });
    }

    function setAndGetData() {
        // arrange
        var memoryAdapter = adapters.getClientAdapter(null, promiseFactory);
        var cacheKey = 'hasA';

        // act
        return memoryAdapter.setData(cacheKey, {a: true}, 10)
            .then(memoryAdapter.getData.bind(memoryAdapter, cacheKey))
            .then(function(result) {
                // assert
                chai.assert.typeOf(result, 'Object');
                chai.assert.equal(result.a, true);
            });
    }

    function setAndGetExpiredData() {
        // arrange
        var memoryAdapter = adapters.getClientAdapter(null, promiseFactory);
        var cacheKey = 'hasA';

        // act
        return memoryAdapter.setData(cacheKey, {a: true}, 1)
            .then(waitPromise)
            .then(memoryAdapter.getData.bind(memoryAdapter, cacheKey))
            // assert
            .then(function() {
                throw new Error('resolved but should be rejected!');
            })
            .catch(function(error) {
                chai.assert.typeOf(error, 'Null');
            });
    }

    function deleteData() {
        // arrange
        var memoryAdapter = adapters.getClientAdapter(null, promiseFactory);
        var cacheKey = 'numberOfCats';

        // act
        return memoryAdapter.setData(cacheKey, 101, 100)
            .then(memoryAdapter.deleteData.bind(memoryAdapter, cacheKey))
            .then(function(result) {
                chai.assert.ok(result);
            });
    }

    function deleteAndGetData() {
        // arrange
        var memoryAdapter = adapters.getClientAdapter(null, promiseFactory);
        var cacheKey = 'numberOfCats';

        // act
        return memoryAdapter.setData(cacheKey, 101, 100)
            .then(memoryAdapter.deleteData.bind(memoryAdapter, cacheKey))
            .then(memoryAdapter.getData.bind(memoryAdapter, cacheKey))
            // assert
            .then(function() {
                throw new Error('resolved but should be rejected!');
            })
            .catch(function(error) {
                chai.assert.typeOf(error, 'Null');
            });
    }
}

function waitPromise() {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve(true);
        }, 300);
    });
}
