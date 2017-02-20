var chai = require('chai');
var adapters = require('../../lib/adapters');
var _rewire = require('rewire');
var Treasury = _rewire('../../index');
var promiseFactory = Treasury.__get__('nativePromise');

describe('Test supported clients and adapter utils', testGetClientAdapter);

function testGetClientAdapter() {
	it('should throw error for undefined as invalid_client', undefClient);
	it('should throw error for falsy as invalid_client', falsyClient);
	it('should return default client adapter', nullClient);
	it('should throw error for unknown as unknown_client', unknownClient);

	function undefClient(done) {
		// arrange
		var result;
		var error;

		// act
		try {
			result = adapters.getClientAdapter();
		} catch (e) {
			error = e;
		}

		// assert
		chai.assert.strictEqual(result, undefined);
		chai.assert.typeOf(error, 'Error');
		chai.assert.equal(error.message, 'invalid_client');

		done();
	}

	function falsyClient(done) {
		// arrange
		var result;
		var error;

		// act
		try {
			result = adapters.getClientAdapter(false);
		} catch (e) {
			error = e;
		}

		// assert
		chai.assert.strictEqual(result, undefined);
		chai.assert.typeOf(error, 'Error');
		chai.assert.equal(error.message, 'invalid_client');

		done();
	}

	function nullClient(done) {
		// arrange
		// act
		var result = adapters.getClientAdapter(null, promiseFactory);

		// assert
		chai.assert.typeOf(result, 'Object');
		chai.assert.typeOf(result.get, 'Function');
		chai.assert.typeOf(result.set, 'Function');
		chai.assert.typeOf(result.del, 'Function');
		chai.assert.typeOf(result.client, 'Null');
		chai.assert.typeOf(result.PromiseFactory, 'Function');
		chai.assert.deepEqual(result.PromiseFactory, promiseFactory);

		done();
	}

	function unknownClient(done) {
		// arrange
		var aFakeClient = new FakeClient();
		var result;
		var error;

		// act
		try {
			result = adapters.getClientAdapter(aFakeClient);
		} catch (e) {
			error = e;
		}

		// assert
		chai.assert.strictEqual(result, undefined);
		chai.assert.typeOf(error, 'Error');
		chai.assert.equal(error.message, 'unknown_client');

		done();
	}
}

function FakeClient() {
	return {clientName: true};
}
