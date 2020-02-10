import sinon from 'sinon';
import MemoryAdapter from './memory';

test('memory adapter should construct', () => {
	// arrange
	const client = sinon.stub();

	// act
	const result = new MemoryAdapter(client);

	// assert
	expect(result).toBeTruthy();
	expect(result.client).toEqual(client);
});

test('memory adapter should get', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemoryAdapter(sinon.stub());

	// act
	try {
		await adapter.get('dogs');
	} catch (error) {
		// assert
		expect(error).toEqual(null);
	}
});

test('memory adapter should set', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemoryAdapter(sinon.stub());

	// act
	const result = await adapter.set('dogs', 'dalmatians', 101);

	// assert
	expect(result).toBeTruthy();
});

test('memory adapter should del', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemoryAdapter(sinon.stub());

	// act
	const result = await adapter.del('dogs');

	// assert
	expect(result).toBeTruthy();
});

test('memory adapter should getCacheItem', () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemoryAdapter(sinon.stub());

	// act
	const result = adapter.getCacheItem('dogs');

	// assert
	expect(result).toEqual(null);
});
