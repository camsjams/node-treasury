var chai = require('chai');
var Treasury = require('../../index');

describe('Test main Treasury public API', testMainApi);

function testMainApi() {
    describe('#testInvest', testInvest);
    describe('#testDivest', testDivest);

    function testInvest() {
        it('should get value from promise directly', notCached);

        function notCached() {
            // arrange
            var treasury = new Treasury();
            var samplePromise = new Promise(function(resolve) {
                resolve('I made a promise Mr. Frodo.');
              });

            // act
            return treasury.invest(samplePromise)
              .then(function() {
                // assert
                console.log('then', arguments);
              });
        }

    }

    function testDivest() {
    }
}
