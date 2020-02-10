const chai = require('chai');
const Treasury = require('../../../index');
const redis = require('redis');

const client = redis.createClient();

describe('Test main Treasury public API using redis', testMainApi);

function testMainApi() {
	describe('#testInvest', testInvest);
	describe('#testDivest', testDivest);

	function testInvest() {
		it('should get value from promise directly', notCached);
		it('should get value from cache', isCached);
		it('should get same value with same options in different order', optionsInDiffOrder);

		function notCached() {
			// arrange
			const treasury = new Treasury({client});
			const expected = 'I made a promise Mr. Frodo.';
			const samplePromise = function() {
				return new Promise((resolve) => {
					resolve(expected);
				});
			};

			// act
			return treasury.invest(samplePromise)
				.then((value) => {
					// assert
					chai.assert.equal(value, expected);
				});
		}

		function isCached() {
			// arrange
			const treasury = new Treasury({client});
			const opts = {namespace: 'isCachedTest', ttl: 25};
			const expected = 31337;
			const firstPromise = function() {
				return new Promise((resolve) => {
					resolve(expected);
				});
			};

			const secondPromise = function() {
				return new Promise((resolve) => {
					resolve(12345);
				});
			};

			// act
			return treasury.invest(firstPromise, opts)
				.then(treasury.invest.bind(null, secondPromise, opts))
				.then((value) => {
					// assert
					chai.assert.equal(value, expected);
				});
		}

		function optionsInDiffOrder() {
			// arrange
			const treasury = new Treasury({client});
			const opts1 = {namespace: 'optionsInDiffOrder', cat: 'Movies', ttl: 25};
			const opts2 = {ttl: 25, namespace: 'optionsInDiffOrder', cat: 'Movies'};
			let expected = 31337;
			let wasSecondPromiseCalled = false;
			const firstPromise = function() {
				return new Promise((resolve) => {
					expected = parseInt(Math.random() * 1000);
					resolve(expected);
				});
			};

			const secondPromise = function() {
				return new Promise((resolve) => {
					wasSecondPromiseCalled = true;
					resolve(Math.random() * 1000);
				});
			};

			// act
			return treasury.invest(firstPromise, opts1)
				.then(treasury.invest.bind(null, secondPromise, opts2))
				.then((value) => {
					// assert
					chai.assert.equal(value, expected);
					chai.assert.notOk(wasSecondPromiseCalled);
				});
		}

	}

	function testDivest() {
		it('should delete value from cache', notCached);
		it('should get value from final promise', delCached);

		function notCached() {
			// arrange
			const treasury = new Treasury({client});
			const opts = {namespace: 'del_notCached', ttl: 25};

			// act
			return treasury.divest(opts);
		}

		function delCached() {
			// arrange
			const treasury = new Treasury({client});
			const opts = {namespace: 'delCached', addValue: 2, ttl: 25};
			const expected = 42;
			const firstPromise = function() {
				return new Promise((resolve) => {
					resolve(31337);
				});
			};

			const secondPromise = function(options) {
				return new Promise((resolve) => {
					resolve(40 + options.addValue);
				});
			};

			// act
			return treasury.invest(firstPromise, opts)
				.then(treasury.divest.bind(null, opts))
				.then(treasury.invest.bind(null, secondPromise, opts))
				.then((value) => {
					// assert
					chai.assert.equal(value, expected);
				});
		}
	}
}
