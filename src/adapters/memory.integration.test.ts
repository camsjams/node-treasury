import MemoryAdapter from './memory';

function waitPromise(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, 300);
	});
}

test('MemoryAdapter should reject when not found in cache', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemoryAdapter(null);

	// act
	try {
		await adapter.get('newKey');
	} catch (e) {
		// assert
		expect(e).toEqual(null);
	}
});

test('MemoryAdapter should set in cache', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemoryAdapter(null);

	// act
	const result = await adapter.set('aCoolKey', {a: true}, 10);

	// assert
	expect(result).toBeTruthy();
});

test('MemoryAdapter should set then get from cache', async () => {
	// arrange
	expect.assertions(2);
	const adapter = new MemoryAdapter(null);
	const EXPECTED = {a: true};
	const cacheKey = 'hasA';

	// act
	const setResult = await adapter.set(cacheKey, {a: true}, 10);
	const getResult = await adapter.get(cacheKey);

	// assert
	expect(setResult).toBeTruthy();
	expect(getResult).toEqual(EXPECTED);
});

test('MemoryAdapter should set then get bad data from cache', async () => {
	// arrange
	expect.assertions(2);
	const adapter = new MemoryAdapter(null);
	const cacheKey = 'hasA';

	// act
	const setResult = await adapter.set(cacheKey, {a: true}, 10);
	await waitPromise();

	try {
		await adapter.get(cacheKey);
	} catch (e) {
		// assert
		expect(setResult).toBeTruthy();
		expect(e).toEqual(null);
	}
});

test('MemoryAdapter should delete from cache', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new MemoryAdapter(null);
	const cacheKey = 'numberOfCats';

	// act
	await adapter.set(cacheKey, 101, 100);
	const delResult = await adapter.del(cacheKey);

	// assert
	expect(delResult).toBeTruthy();
});

test('MemoryAdapter should delete from cache and not get later', async () => {
	// arrange
	expect.assertions(3);
	const adapter = new MemoryAdapter(null);
	const cacheKey = 'otherNumberOfCats';

	// act
	const setResult = await adapter.set(cacheKey, {a: true}, 10);
	const delResult = await adapter.del(cacheKey);

	try {
		await adapter.get(cacheKey);
	} catch (e) {
		// assert
		expect(setResult).toBeTruthy();
		expect(delResult).toBeTruthy();
		expect(e).toEqual(null);
	}
});
