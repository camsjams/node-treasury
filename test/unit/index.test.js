var chai = require('chai');
var Treasury = require('../../index');

describe('Test main Treasury public API', testMainApi);

function testMainApi() {
    describe('#testInvest', testInvest);
    describe('#testDivest', testDivest);

    function testInvest() {
        it.only('should get value from promise directly', notCached);

        function notCached() {
            // arrange
            var treasury = new Treasury();
            var expected = 'I made a promise Mr. Frodo.';
            var samplePromise = new Promise(function(resolve) {
                resolve(expected);
            });

            // act
            return treasury.invest(samplePromise)
              .then(function(value) {
                // assert
                chai.assert.equal(value, expected);
              });
        }

    }

    function testDivest() {
    }
}
