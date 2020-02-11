import sinon from 'sinon';
import MemoryAdapter from './memory';
import {TreasuryClient} from './base';

test('memory adapter should construct', () => {
	// arrange
	const client = sinon.stub();

	// act
	const result = new MemoryAdapter(client as unknown as TreasuryClient);

	// assert
	expect(result).toBeTruthy();
	expect(result.client).toEqual(client);
});

test('memory adapter should get [no data set]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemoryAdapter(sinon.stub() as unknown as TreasuryClient);

	// act
	try {
		await adapter.get('dogs');
	} catch (error) {
		// assert
		expect(error).toEqual(null);
	}
});

test('memory adapter should get [has data set]', async () => {
	// arrange
	expect.assertions(1);
	const KEY = 'cats';
	const EXPECTED = {
		calico: 1,
		blackAndWhite: 3,
		tabby: 1
	};
	const adapter = new MemoryAdapter(sinon.stub() as unknown as TreasuryClient);
	await adapter.set(KEY, EXPECTED, 122);

	// act
	const result = await adapter.get(KEY);

	// assert
	expect(result).toEqual(EXPECTED);
});

test('memory adapter should set', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemoryAdapter(sinon.stub() as unknown as TreasuryClient);

	// act
	const result = await adapter.set('dogs', 'dalmatians', 101);

	// assert
	expect(result).toBeTruthy();
});

test('memory adapter should del', async () => {
	// arrange
	const adapter = new MemoryAdapter(sinon.stub() as unknown as TreasuryClient);

	// act
	const result = await adapter.del('dogs');

	// assert
	expect(result).toBeTruthy();
});

test('memory adapter should getCacheItem [no item found]', () => {
	// arrange
	const adapter = new MemoryAdapter(sinon.stub() as unknown as TreasuryClient);

	// act
	const result = adapter.getCacheItem('dogs' + Math.random());

	// assert
	expect(result).toEqual(null);
});

test('memory adapter should getCacheItem [delete expired item found]', async () => {
	// arrange
	expect.assertions(1);
	const clock = sinon.useFakeTimers();
	const KEY = 'expiredFood' + Math.random();
	const EXPECTED = {data: true};
	const adapter = new MemoryAdapter(sinon.stub() as unknown as TreasuryClient);
	await adapter.set(KEY, EXPECTED, 10);

	// act I
	const resultOne = adapter.getCacheItem(KEY);

	// act II
	clock.tick(5);
	clock.next();
	const resultTwo = adapter.getCacheItem(KEY);

	// act III
	clock.tick(11);
	clock.next();
	const resultThree = adapter.getCacheItem(KEY);

	// assert
	expect([resultOne, resultTwo, resultThree]).toEqual([EXPECTED, EXPECTED, null]);
});
