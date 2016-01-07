var chai = require('chai');
var Treasury = require('../../index');

describe('Test main Treasury public API', testMainApi);

function testMainApi() {
    describe('#testInvest', testInvest);
    describe('#testDivest', testDivest);

    function testInvest() {
        it('should get value from promise directly', notCached);
        it.only('should get value from cache', isCached);

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

        function isCached() {
            // arrange
            var treasury = new Treasury();
            var opts = {namespace: 'isCachedTest'}
            var expected = 31337;
            var firstPromise = new Promise(function(resolve) {
                resolve(expected);
            });
            var secondPromise = new Promise(function(resolve) {
                resolve(12345);
            });

            // act
            return treasury.invest(firstPromise, opts)
              .then(treasury.invest.bind(null, secondPromise, opts))
              .then(function(value) {
                console.log('end', value);
                // assert
                chai.assert.equal(value, expected);
              });
        }

    }

    function testDivest() {
    }
}
