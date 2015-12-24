var chai = require('chai');
var adapters = require('../../lib/adapters');
var Memcached = require('memcached');
var redis = require('redis');

describe('Test supported clients and adapter utils', testAdapters);

function testAdapters() {
    describe('#testGetClientAdapter', testGetClientAdapter);
    describe('#testMemory', testMemory);
    describe('#testRedis', testRedis);
    describe('#testMemcached', testMemcached);

    function testGetClientAdapter() {
        it('should throw error for undefined as invalid_client', undefClient);
        it('should throw error for null as invalid_client', nullClient);
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

        function nullClient(done) {
            // arrange
            var result;
            var error;

            // act
            try {
                result = adapters.getClientAdapter(null);
            } catch (e) {
                error = e;
            }

            // assert
            chai.assert.strictEqual(result, undefined);
            chai.assert.typeOf(error, 'Error');
            chai.assert.equal(error.message, 'invalid_client');

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

        function getMemoryAdapter(done) {
            // arrange
            var memoryClient = new adapters.MemoryClientAdapter(null);

            // act
            var result = adapters.getClientAdapter(memoryClient);

            // assert
            chai.assert.typeOf(result, 'Object');
            chai.assert.typeOf(result.get, 'Function');
            chai.assert.typeOf(result.set, 'Function');
            chai.assert.typeOf(result.client, 'Null');

            done();
        }
    }

    function testRedis() {
        it('should return a redis client adapter', getRedisAdapter);

        function getRedisAdapter(done) {
            // arrange
            var client = redis.createClient();

            // act
            var result = adapters.getClientAdapter(client);

            // assert
            chai.assert.typeOf(result, 'Object');
            chai.assert.typeOf(result.get, 'Function');
            chai.assert.typeOf(result.set, 'Function');
            chai.assert.deepEqual(result.client, client);

            done();
        }
    }

    function testMemcached() {
        it('should return a memcached client adapter', getMemcachedAdapter);

        function getMemcachedAdapter(done) {
            // arrange
            var memcached = new Memcached();

            // act
            var result = adapters.getClientAdapter(memcached);

            // assert
            chai.assert.typeOf(result, 'Object');
            chai.assert.typeOf(result.get, 'Function');
            chai.assert.typeOf(result.set, 'Function');
            chai.assert.deepEqual(result.client, memcached);

            done();
        }
    }
}