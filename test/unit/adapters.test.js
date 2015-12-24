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
        it('should have thrown an error with undefined client as invalid_client', undefAdapter);
        it('should have thrown an error with null client as invalid_client', nullAdapter);
        it('should have thrown an error with unknown client unknown_client', unknownAdapter);

        function undefAdapter(done) {
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

        function nullAdapter(done) {
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

        function unknownAdapter(done) {
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
        it('should have returned a memory client adapter', getMemoryAdapter);

        function getMemoryAdapter(done) {
            // arrange
            // act
            var result = adapters.getClientAdapter(new adapters.MemoryClientAdapter(null));

            // assert
            chai.assert.typeOf(result, 'Object');
            chai.assert.typeOf(result.get, 'Function');
            chai.assert.typeOf(result.set, 'Function');
            chai.assert.typeOf(result.client, 'Null');

            done();
        }
    }

    function testRedis() {
        it('should have returned a redis client adapter', getRedisAdapter);

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
        it('should have returned a memcached client adapter', getMemcachedAdapter);

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