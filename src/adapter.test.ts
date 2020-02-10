import chai from 'chai';
import sinon from 'sinon';
import getAdapter from './adapter';

test('should throw error for undefined as invalid_client', () => {
	// arrange
	let result;
	let error;

	// act
	try {
		result = getAdapter();
	} catch (e) {
		error = e;
	}

	// assert
	chai.assert.strictEqual(result, undefined);
	chai.assert.typeOf(error, 'Error');
	chai.assert.equal(error.message, 'invalid_client');
});

test('should throw error for falsy as invalid_client', () => {
	// arrange
	let result;
	let error;

	// act
	try {
		result = getAdapter(false);
	} catch (e) {
		error = e;
	}

	// assert
	chai.assert.strictEqual(result, undefined);
	chai.assert.typeOf(error, 'Error');
	chai.assert.equal(error.message, 'invalid_client');
});

test('should return default client adapter', () => {
	// arrange
	// act
	const result = getAdapter(null);

	// assert
	chai.assert.typeOf(result, 'Object');
	chai.assert.typeOf(result.get, 'Function');
	chai.assert.typeOf(result.set, 'Function');
	chai.assert.typeOf(result.del, 'Function');
	chai.assert.typeOf(result.client, 'Null');
});

test('should return Redis client adapter', () => {
	// arrange
	const EXPECTED = {
		constructor: {
			name: 'RedisClient'
		}
	};

	// act
	const result = getAdapter(EXPECTED);

	// assert
	chai.assert.typeOf(result, 'Object');
	chai.assert.typeOf(result.get, 'Function');
	chai.assert.typeOf(result.set, 'Function');
	chai.assert.typeOf(result.del, 'Function');
	expect(result.client).toEqual(EXPECTED);
});

test('should return Memcached client adapter', () => {
	// arrange
	const EXPECTED = {
		constructor: {
			name: 'Client'
		}
	};

	// act
	const result = getAdapter(EXPECTED);

	// assert
	chai.assert.typeOf(result, 'Object');
	chai.assert.typeOf(result.get, 'Function');
	chai.assert.typeOf(result.set, 'Function');
	chai.assert.typeOf(result.del, 'Function');
	expect(result.client).toEqual(EXPECTED);
});

test('should throw error for unknown as unknown_client', () => {
	// arrange
	let result;
	let error;

	// act
	try {
		result = getAdapter(sinon.stub());
	} catch (e) {
		error = e;
	}

	// assert
	chai.assert.strictEqual(result, undefined);
	chai.assert.typeOf(error, 'Error');
	chai.assert.equal(error.message, 'unknown_client');
});
