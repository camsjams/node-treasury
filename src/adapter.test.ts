import sinon from 'sinon';
import getAdapter from './adapter';
import {TreasuryClient} from './adapters/base';

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
	expect(result).toEqual(undefined);
	expect(error.message).toEqual('invalid_client');
});

test('should throw error for falsy as invalid_client', () => {
	// arrange
	let result;
	let error;

	// act
	try {
		result = getAdapter(false as unknown as TreasuryClient);
	} catch (e) {
		error = e;
	}

	// assert
	expect(result).toEqual(undefined);
	expect(error.message).toEqual('invalid_client');
});

test('should return default client adapter', () => {
	// arrange
	// act
	const result = getAdapter(null);

	// assert
	expect(result).toBeTruthy();
	expect(result.constructor.name).toEqual('MemoryClientAdapter');
});

test('should return Redis client adapter', () => {
	// arrange
	const EXPECTED = {
		constructor: {
			name: 'RedisClient'
		}
	};

	// act
	const result = getAdapter(EXPECTED as unknown as TreasuryClient);

	// assert
	expect(result.client).toEqual(EXPECTED);
	expect(result.constructor.name).toEqual('RedisClientAdapter');
});

test('should return Memcached client adapter', () => {
	// arrange
	const EXPECTED = {
		constructor: {
			name: 'Client'
		}
	};

	// act
	const result = getAdapter(EXPECTED as unknown as TreasuryClient);

	// assert
	expect(result.client).toEqual(EXPECTED);
	expect(result.constructor.name).toEqual('MemcachedClientAdapter');
});

test('should throw error for unknown as unknown_client', () => {
	// arrange
	let result;
	let error;

	// act
	try {
		result = getAdapter(sinon.stub() as unknown as TreasuryClient);
	} catch (e) {
		error = e;
	}

	// assert
	expect(result).toEqual(undefined);
	expect(error.message).toEqual('unknown_client');
});
