var chai = require('chai');
var Treasury = require('../../index');

describe('Test supported promise factories', testPromiseFactories);

function testPromiseFactories() {
	describe('#testNative', testNative);
	describe('#testQ', testQ);
	describe('#testBluebird', testBluebird);

	var expected = 12345;

	function samplePromisedValue() {
		return new Promise((resolve) => {
			resolve(expected);
		});
	}

	function testNative() {
		it('should return a Promise', basicPromise);

		function basicPromise() {
			// arrange
			var treasury = new Treasury();

			// act
			return treasury.invest(samplePromisedValue)
				.then((result) => {
					// assert
					chai.assert.equal(result, expected);
				});
		}
	}

	function testQ() {
		it('should return a Q Promise', basicPromise);

		function basicPromise() {
			// arrange
			var treasury = new Treasury({promiseFactory: require('q').Promise});

			// act
			return treasury.invest(samplePromisedValue)
				.then((result) => {
					// assert
					chai.assert.equal(result, expected);
				});
		}
	}

	function testBluebird() {
		it('should return a Bluebird Promise', basicPromise);

		function basicPromise() {
			// arrange
			var treasury = new Treasury({promiseFactory: require('bluebird')});

			// act
			return treasury.invest(samplePromisedValue)
				.then((result) => {
					// assert
					chai.assert.equal(result, expected);
				});
		}
	}
}
