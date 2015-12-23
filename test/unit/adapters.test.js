var chai = require('chai');
var adapters = require('../../lib/adapters');

describe('Test supported clients and adapter utils', testAdapters);

function testAdapters() {
    describe('#testGetClientAdapter', testGetClientAdapter);
    describe('#testMemory', testMemory);
    describe('#testRedis', testRedis);
    describe('#testMemcached', testMemcached);

    function testGetClientAdapter() {
        it('should have thrown an error with undefined client', nullAdapter);
        it('should have thrown an error with null client', nullAdapter);
        it('should have thrown an error with unknown client', unknownAdapter);

        function undefAdapter(done) {
            // arrange
            // act
            var result = adapters.getClientAdapter();

            // assert
            chai.assert.typeOf(result, 'Promise');

            done();
        }

        function nullAdapter(done) {
            // arrange
            // act
            var result = adapters.getClientAdapter(null);

            // assert
            chai.assert.typeOf(result, 'Promise');

            done();
        }

        function unknownAdapter(done) {
            // arrange
            var unknownClient = new function() {
                // fake client here
            };

            // act
            var result = adapters.getClientAdapter(null);

            // assert
            chai.assert.typeOf(result, 'Promise');

            done();
        }
    }

    function testMemory() {
    }

    function testRedis() {
    }

    function testMemcached() {
    }
}