var chai = require('chai');
var Treasury = require('../../index');

describe('Test main Treasury public API using memory', testMainApi);

function testMainApi() {
    describe('#testInvest', testInvest);
    describe('#testDivest', testDivest);

    function testInvest() {
        it('should get value from promise directly', notCached);
        it('should get value from cache', isCached);

        function notCached() {
            // arrange
            var treasury = new Treasury();
            var expected = 'I made a promise Mr. Frodo.';
            var samplePromise = function(){ return new Promise(function(resolve) {
                resolve(expected);
            })};

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
            var firstPromise = function(){ return new Promise(function(resolve) {
                resolve(expected);
            })
          };
            var secondPromise = function(){return  new Promise(function(resolve) {
                resolve(12345);
            })
          };

            // act
            return treasury.invest(firstPromise, opts)
              .then(treasury.invest.bind(null, secondPromise, opts))
              .then(function(value) {
                // assert
                chai.assert.equal(value, expected);
              });
        }

    }

    function testDivest() {
      it('should delete value from cache', notCached);
      it('should get value from final promise', delCached);

      function notCached() {
        // arrange
        var treasury = new Treasury();
        var opts = {namespace: 'del_notCached'};

        // act
        return treasury.divest(opts);
      }

      function delCached() {
          // arrange
          var treasury = new Treasury();
          var opts = {namespace: 'delCached', addValue: 2};
          var expected = 42;
          var firstPromise = function(){ return new Promise(function(resolve) {
              resolve(31337);
          })
        };
          var secondPromise = function(options){
            return new Promise(function(resolve) {
              resolve(40 + options.addValue);
          });
        };

          // act
          return treasury.invest(firstPromise, opts)
            .then(treasury.divest.bind(null, opts))
            .then(treasury.invest.bind(null, secondPromise, opts))
            .then(function(value) {
              // assert
              chai.assert.equal(value, expected);
            });
      }
    }
}
