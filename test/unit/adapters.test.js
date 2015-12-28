var chai = require('chai');
var adapters = require('../../lib/adapters');
var Memcached = require('memcached');
var redis = require('redis');
var _rewire = require('rewire');
var Treasury = _rewire('../../index');
var promiseFactory = Treasury.__get__('nativePromise');

describe('Test supported clients and adapter utils', testAdapters);

function testAdapters() {
    describe('#testGetClientAdapter', testGetClientAdapter);
    describe('#testMemory', testMemory);
    describe('#testRedis', testRedis);
    describe('#testMemcached', testMemcached);

    function testGetClientAdapter() {
        it('should throw error for undefined as invalid_client', undefClient);
        it('should throw error for falsy as invalid_client', falsyClient);
        it('should return default client adapter', nullClient);
        it('should throw error for unknown as unknown_client', unknownClient);

        function undefClient(done) {
            // arrange
            var result;
            var error;

            // act
            try {
                result = adapters.getClientAdapter();
            } catch (e) {
                error = e;
            }

            // assert
            chai.assert.strictEqual(result, undefined);
            chai.assert.typeOf(error, 'Error');
            chai.assert.equal(error.message, 'invalid_client');

            done();
        }

        function falsyClient(done) {
            // arrange
            var result;
            var error;

            // act
            try {
                result = adapters.getClientAdapter(false);
            } catch (e) {
                error = e;
            }

            // assert
            chai.assert.strictEqual(result, undefined);
            chai.assert.typeOf(error, 'Error');
            chai.assert.equal(error.message, 'invalid_client');

            done();
        }

        function nullClient(done) {
            // arrange
            // act
            var result = adapters.getClientAdapter(null, promiseFactory);

            // assert
            chai.assert.typeOf(result, 'Object');
            chai.assert.typeOf(result.getData, 'Function');
            chai.assert.typeOf(result.setData, 'Function');
            chai.assert.typeOf(result.deleteData, 'Function');
            chai.assert.typeOf(result.client, 'Null');
            chai.assert.typeOf(result.promiseFactory, 'Function');
            chai.assert.deepEqual(result.promiseFactory, promiseFactory);

            done();
        }

        function unknownClient(done) {
            // arrange
            var unknownClient = new function() {
                // fake client here
            };
            var result;
            var error;

            // act
            try {
                result = adapters.getClientAdapter(unknownClient);
            } catch (e) {
                error = e;
            }

            // assert
            chai.assert.strictEqual(result, undefined);
            chai.assert.typeOf(error, 'Error');
            chai.assert.equal(error.message, 'unknown_client');

            done();
        }
    }

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
            chai.assert.typeOf(result.promiseFactory, 'Function');
            chai.assert.deepEqual(result.promiseFactory, promiseFactory);

            done();
        }

        function getDataFromEmpty() {
            // arrange
            var memoryAdapter = adapters.getClientAdapter(null, promiseFactory);

            // act
            return memoryAdapter.getData()
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
                    chai.assert.typeOf(result, 'Number');
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
            return memoryAdapter.setData(cacheKey, {a: true}, 0)
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
            var client = redis.createClient();

            // act
            var result = adapters.getClientAdapter(client, promiseFactory);

            // assert
            chai.assert.typeOf(result, 'Object');
            chai.assert.typeOf(result.getData, 'Function');
            chai.assert.typeOf(result.setData, 'Function');
            chai.assert.typeOf(result.deleteData, 'Function');
            chai.assert.deepEqual(result.client, client);
            chai.assert.typeOf(result.promiseFactory, 'Function');
            chai.assert.deepEqual(result.promiseFactory, promiseFactory);

            done();
        }

        function getDataFromEmpty() {
            // arrange
            var client = redis.createClient();
            var redisAdapter = adapters.getClientAdapter(client, promiseFactory);

            // act
            return redisAdapter.getData()
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
            var client = redis.createClient();
            var redisAdapter = adapters.getClientAdapter(client, promiseFactory);

            // act
            return redisAdapter.setData('aCoolKey', {a: true}, 10)
                .then(function(result) {
                    // assert
                    chai.assert.typeOf(result, 'Number');
                });
        }

        function setAndGetData() {
            // arrange
            var client = redis.createClient();
            var redisAdapter = adapters.getClientAdapter(client, promiseFactory);
            var cacheKey = 'hasA';

            // act
            return redisAdapter.setData(cacheKey, {a: true}, 10)
                .then(redisAdapter.getData.bind(redisAdapter, cacheKey))
                .then(function(result) {
                    // assert
                    chai.assert.typeOf(result, 'Object');
                    chai.assert.equal(result.a, true);
                });
        }

        function setAndGetExpiredData() {
            // arrange
            var client = redis.createClient();
            var redisAdapter = adapters.getClientAdapter(client, promiseFactory);
            var cacheKey = 'hasA';

            // act
            return redisAdapter.setData(cacheKey, {a: true}, 0)
                .then(waitPromise)
                .then(redisAdapter.getData.bind(redisAdapter, cacheKey))
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
            var client = redis.createClient();
            var redisAdapter = adapters.getClientAdapter(client, promiseFactory);
            var cacheKey = 'numberOfCats';

            // act
            return redisAdapter.setData(cacheKey, 101, 100)
                .then(redisAdapter.deleteData.bind(redisAdapter, cacheKey))
                .then(function(result) {
                    chai.assert.ok(result);
                });
        }

        function deleteAndGetData() {
            // arrange
            var client = redis.createClient();
            var redisAdapter = adapters.getClientAdapter(client, promiseFactory);
            var cacheKey = 'numberOfCats';

            // act
            return redisAdapter.setData(cacheKey, 101, 100)
                .then(redisAdapter.deleteData.bind(redisAdapter, cacheKey))
                .then(redisAdapter.getData.bind(redisAdapter, cacheKey))
                // assert
                .then(function() {
                    throw new Error('resolved but should be rejected!');
                })
                .catch(function(error) {
                    chai.assert.typeOf(error, 'Null');
                });
        }
    }

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
            var memoryAdapter = adapters.getClientAdapter(null, promiseFactory);

            // act
            return memoryAdapter.getData()
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
                    chai.assert.typeOf(result, 'Number');
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
            return memoryAdapter.setData(cacheKey, {a: true}, 0)
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
}

function waitPromise() {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve(true);
        }, 300);
    });
}