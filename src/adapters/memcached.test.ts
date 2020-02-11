import sinon from 'sinon';
import MemcachedAdapter from './memcached';
import {TreasuryClient} from './base';

test('memcached adapter should construct', () => {
	// arrange
	const client = sinon.stub();

	// act
	const result = new MemcachedAdapter(client as unknown as TreasuryClient);

	// assert
	expect(result).toBeTruthy();
	expect(result.client).toEqual(client);
});

test('memcached adapter should get [rejects from Error]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemcachedAdapter({
		get: sinon.stub().yields(new Error('invalid database'))
	} as unknown as TreasuryClient);

	// act
	try {
		await adapter.get('dogs');
	} catch (error) {
		// assert
		expect(error).toEqual(null);
	}
});

test('memcached adapter should get [rejects from undefined value]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemcachedAdapter({
		get: sinon.stub().yields(undefined, undefined)
	} as unknown as TreasuryClient);

	// act
	try {
		await adapter.get('dogs');
	} catch (error) {
		// assert
		expect(error).toEqual(null);
	}
});

test('memcached adapter should get [resolves]', async () => {
	// arrange
	expect.assertions(1);
	const INPUT = 'dogs';
	const EXPECTED = {dogs: true};
	const adapter = new MemcachedAdapter({
		get: sinon.stub().withArgs(INPUT).yields(undefined, '{"dogs":true}')
	} as unknown as TreasuryClient);

	// act
	const result = await adapter.get('dogs');

	// assert
	expect(result).toEqual(EXPECTED);
});

test('memcached adapter should set [rejects from Error]', async () => {
	// arrange
	expect.assertions(1);
	const ERROR = new Error('invalid database');
	const adapter = new MemcachedAdapter({
		set: sinon.stub().yields(ERROR)
	} as unknown as TreasuryClient);

	// act
	try {
		await adapter.set('dogs', 'dalmatians', 101);
	} catch (error) {
		// assert
		expect(error).toEqual(ERROR);
	}
});

test('memcached adapter should set [resolves]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemcachedAdapter({
		set: sinon.stub().withArgs('dogs', 101, 'dalmatians').yields(undefined)
	} as unknown as TreasuryClient);

	// act
	const result = await adapter.set('dogs', 'dalmatians', 101);

	// assert
	expect(result).toBeTruthy();
});

test('memcached adapter should del [rejects from Error]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemcachedAdapter({
		del: sinon.stub().yields(new Error('invalid database'))
	} as unknown as TreasuryClient);

	// act
	try {
		await adapter.del('dogs');
	} catch (error) {
		// assert
		expect(error).toEqual(null);
	}
});

test('memcached adapter should del [rejects from null value]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemcachedAdapter({
		del: sinon.stub().yields(undefined, null)
	} as unknown as TreasuryClient);

	// act
	try {
		await adapter.del('dogs');
	} catch (error) {
		// assert
		expect(error).toEqual(null);
	}
});

test('memcached adapter should del [resolves]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemcachedAdapter({
		del: sinon.stub().withArgs('dogs').yields(undefined)
	} as unknown as TreasuryClient);

	// act
	const result = await adapter.del('dogs');

	// assert
	expect(result).toBeTruthy();
});
