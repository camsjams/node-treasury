const chai = require('chai');
const _rewire = require('rewire');

const Treasury = _rewire('../../index');

describe('Test default and supported options', testOptions);

function testOptions() {
	describe('#testDefaultOptions', testDefaultOptions);
	describe('#testCleanedOptions', testCleanedOptions);

	function testDefaultOptions() {
		it('should accept undefined options', undefOpts);
		it('should accept null options', nullOpts);
		it('should accept empty options', emptyOpts);

		function undefOpts(done) {
			// arrange
			const getDefaultOptions = Treasury.__get__('getDefaultOptions');

			// act
			const result = getDefaultOptions();

			// assert
			chai.assert.typeOf(result, 'Object');
			chai.assert.typeOf(result.client, 'Null');
			chai.assert.equal(result.ttl, 300);
			chai.assert.equal(result.namespace, 'Treasury');
			chai.assert.typeOf(result.promiseFactory, 'Function');

			done();
		}

		function nullOpts(done) {
			// arrange
			const getDefaultOptions = Treasury.__get__('getDefaultOptions');

			// act
			const result = getDefaultOptions(null);

			// assert
			chai.assert.typeOf(result, 'Object');
			chai.assert.typeOf(result.client, 'Null');
			chai.assert.equal(result.ttl, 300);
			chai.assert.equal(result.namespace, 'Treasury');
			chai.assert.typeOf(result.promiseFactory, 'Function');

			done();
		}

		function emptyOpts(done) {
			// arrange
			const getDefaultOptions = Treasury.__get__('getDefaultOptions');

			// act
			const result = getDefaultOptions({});

			// assert
			chai.assert.typeOf(result, 'Object');
			chai.assert.typeOf(result.client, 'Null');
			chai.assert.equal(result.ttl, 300);
			chai.assert.equal(result.namespace, 'Treasury');
			chai.assert.typeOf(result.promiseFactory, 'Function');

			done();
		}
	}

	function testCleanedOptions() {
		it('should accept undefined options', undefOpts);
		it('should accept null options', nullOpts);
		it('should accept empty options', emptyOpts);
		it('should accept a ttl', customDefaultTtl);
		it('should accept a namespace', customDefaultNamespace);
		it('should accept a client', customClient);
		it('should accept a promise', customPromise);

		function undefOpts(done) {
			// arrange
			const getCleanedOptions = Treasury.__get__('getCleanedOptions');

			// act
			const result = getCleanedOptions();

			// assert
			chai.assert.typeOf(result, 'Object');
			chai.assert.typeOf(result.client, 'Null');
			chai.assert.equal(result.ttl, 300);
			chai.assert.equal(result.namespace, 'Treasury');
			chai.assert.typeOf(result.promiseFactory, 'Function');

			done();
		}

		function nullOpts(done) {
			// arrange
			const getCleanedOptions = Treasury.__get__('getCleanedOptions');

			// act
			const result = getCleanedOptions(null);

			// assert
			chai.assert.typeOf(result, 'Object');
			chai.assert.typeOf(result.client, 'Null');
			chai.assert.equal(result.ttl, 300);
			chai.assert.equal(result.namespace, 'Treasury');
			chai.assert.typeOf(result.promiseFactory, 'Function');

			done();
		}

		function emptyOpts(done) {
			// arrange
			const getCleanedOptions = Treasury.__get__('getCleanedOptions');

			// act
			const result = getCleanedOptions({});

			// assert
			chai.assert.typeOf(result, 'Object');
			chai.assert.typeOf(result.client, 'Null');
			chai.assert.equal(result.ttl, 300);
			chai.assert.equal(result.namespace, 'Treasury');
			chai.assert.typeOf(result.promiseFactory, 'Function');

			done();
		}

		function customDefaultTtl(done) {
			// arrange
			const getCleanedOptions = Treasury.__get__('getCleanedOptions');

			// act
			const result = getCleanedOptions({ttl: 1337});

			// assert
			chai.assert.typeOf(result, 'Object');
			chai.assert.equal(result.ttl, 1337);

			done();
		}

		function customDefaultNamespace(done) {
			// arrange
			const getCleanedOptions = Treasury.__get__('getCleanedOptions');

			// act
			const result = getCleanedOptions({namespace: 'ScroogeMcDuck'});

			// assert
			chai.assert.typeOf(result, 'Object');
			chai.assert.equal(result.namespace, 'ScroogeMcDuck');

			done();
		}

		function customClient(done) {
			// arrange
			const getCleanedOptions = Treasury.__get__('getCleanedOptions');
			const myFakeClient = new function() {
				return 1245;
			};

			// act
			const result = getCleanedOptions({client: myFakeClient});

			// assert
			chai.assert.typeOf(result, 'Object');
			chai.assert.typeOf(result.client, 'Object');
			chai.assert.deepEqual(result.client, myFakeClient);

			done();
		}

		function customPromise(done) {
			// arrange
			const getCleanedOptions = Treasury.__get__('getCleanedOptions');
			const myFakePromise = function() {
				return 1245;
			};

			// act
			const result = getCleanedOptions({promiseFactory: myFakePromise});

			// assert
			chai.assert.typeOf(result, 'Object');
			chai.assert.typeOf(result.promiseFactory, 'Function');
			chai.assert.deepEqual(result.promiseFactory, myFakePromise);

			done();
		}
	}
}
