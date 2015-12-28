var chai = require('chai');
var adapters = require('../../../lib/adapters');
var Memcached = require('memcached');
var _rewire = require('rewire');
var Treasury = _rewire('../../../index');
var promiseFactory = Treasury.__get__('nativePromise');

describe('Test Memcached client and adapter', testMemcached);

function testMemcached() {
    it('should return a memcached client adapter', getMemcachedAdapter);
    //it('should reject when not found in cache', getDataFromEmpty);
    //it('should set in cache', setData);
    //it('should set then get from cache', setAndGetData);
    //it('should set then get bad data from cache', setAndGetExpiredData);
    //it('should delete from cache', deleteData);
    //it('should delete from cache and not get later', deleteAndGetData);

    function getMemcachedAdapter(done) {
        // arrange
        var memcached = new Memcached();

        // act
        var result = adapters.getClientAdapter(memcached, promiseFactory);

        // assert
        chai.assert.typeOf(result, 'Object');
        chai.assert.typeOf(result.getData, 'Function');
        chai.assert.typeOf(result.setData, 'Function');
        chai.assert.typeOf(result.deleteData, 'Function');
        chai.assert.deepEqual(result.client, memcached);
        chai.assert.typeOf(result.promiseFactory, 'Function');
        chai.assert.deepEqual(result.promiseFactory, promiseFactory);

        done();
    }

    function getDataFromEmpty() {
        // arrange
        var client = new Memcached();
        var memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);

        // act
        return memcachedAdapter.getData()
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
        var client = new Memcached();
        var memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);

        // act
        return memcachedAdapter.setData('aCoolKey', {a: true}, 10)
            .then(function(result) {
                // assert
                chai.assert.typeOf(result, 'Number');
            });
    }

    function setAndGetData() {
        // arrange
        var client = new Memcached();
        var memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);
        var cacheKey = 'hasA';

        // act
        return memcachedAdapter.setData(cacheKey, {a: true}, 10)
            .then(memcachedAdapter.getData.bind(memcachedAdapter, cacheKey))
            .then(function(result) {
                // assert
                chai.assert.typeOf(result, 'Object');
                chai.assert.equal(result.a, true);
            });
    }

    function setAndGetExpiredData() {
        // arrange
        var client = new Memcached();
        var memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);
        var cacheKey = 'hasA';

        // act
        return memcachedAdapter.setData(cacheKey, {a: true}, 0)
            .then(waitPromise)
            .then(memcachedAdapter.getData.bind(memcachedAdapter, cacheKey))
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
        var client = new Memcached();
        var memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);
        var cacheKey = 'numberOfCats';

        // act
        return memcachedAdapter.setData(cacheKey, 101, 100)
            .then(memcachedAdapter.deleteData.bind(memcachedAdapter, cacheKey))
            .then(function(result) {
                chai.assert.ok(result);
            });
    }

    function deleteAndGetData() {
        // arrange
        var client = new Memcached();
        var memcachedAdapter = adapters.getClientAdapter(client, promiseFactory);
        var cacheKey = 'numberOfCats';

        // act
        return memcachedAdapter.setData(cacheKey, 101, 100)
            .then(memcachedAdapter.deleteData.bind(memcachedAdapter, cacheKey))
            .then(memcachedAdapter.getData.bind(memcachedAdapter, cacheKey))
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