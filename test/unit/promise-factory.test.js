var assert = require('assert');
var Treasury = require('../../index');
var treasury = new Treasury();

describe('Test supported promise factories', testPromiseFactories);

function testPromiseFactories() {
    describe('#testNative', testNative);

    function testNative() {

        it('should have returned a Promise', basicPromise);

        function basicPromise() {
            // arrange
            var cachedFunction = treasury.invest();

            // act
            return cachedFunction()
                .then(
                function fulfilled(result) {
                    // assert
                    console.log('fulfilled result', result);
                    assert(result);
                },
                function rejected(error) {
                    throw new Error('cachedFunction Promise was unexpectedly rejected with:', error);
                });
        }

    }
}