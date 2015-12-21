var assert = require('assert');

describe('Test supported promise factories', testPromiseFactories);

function testPromiseFactories() {
    describe('#testNative', testNative);

    function testNative() {

        it('should have returned a Promise', basicPromise);

        function basicPromise(done) {
            // arrange

            // act

            // assert
            done();
        }

    }
}