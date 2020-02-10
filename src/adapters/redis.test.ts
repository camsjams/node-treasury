import sinon from 'sinon';
import RedisAdapter from './redis';

test('redis adapter should construct', () => {
	// arrange
	const client = sinon.stub();

	// act
	const result = new RedisAdapter(client);

	// assert
	expect(result).toBeTruthy();
	expect(result.client).toEqual(client);
});

test('redis adapter should get [rejects from Error]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new RedisAdapter({get: sinon.stub().yields(new Error('invalid database'))});

	// act
	try {
		await adapter.get('dogs');
	} catch (error) {
		// assert
		expect(error).toEqual(null);
	}
});

test('redis adapter should get [rejects from null value]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new RedisAdapter({get: sinon.stub().yields(undefined, null)});

	// act
	try {
		await adapter.get('dogs');
	} catch (error) {
		// assert
		expect(error).toEqual(null);
	}
});

test('redis adapter should get [resolves]', async () => {
	// arrange
	expect.assertions(1);
	const INPUT = 'dogs';
	const EXPECTED = {dogs: true};
	const adapter = new RedisAdapter({get: sinon.stub().withArgs(INPUT).yields(undefined, '{"dogs":true}')});

	// act
	const result = await adapter.get('dogs');

	// assert
	expect(result).toEqual(EXPECTED);
});

test('redis adapter should set [rejects from Error]', async () => {
	// arrange
	expect.assertions(1);
	const ERROR = new Error('invalid database');
	const adapter = new RedisAdapter({setex: sinon.stub().yields(ERROR)});

	// act
	try {
		await adapter.set('dogs', 'dalmatians', 101);
	} catch (error) {
		// assert
		expect(error).toEqual(ERROR);
	}
});

test('redis adapter should set [resolves]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new RedisAdapter({setex: sinon.stub().withArgs('dogs', 'dalmatians', 101).yields(undefined)});

	// act
	const result = await adapter.set('dogs', 'dalmatians', 101);

	// assert
	expect(result).toBeTruthy();
});

test('redis adapter should del [rejects from Error]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new RedisAdapter({del: sinon.stub().yields(new Error('invalid database'))});

	// act
	try {
		await adapter.del('dogs');
	} catch (error) {
		// assert
		expect(error).toEqual(null);
	}
});

test('redis adapter should del [rejects from null value]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new RedisAdapter({del: sinon.stub().yields(undefined, null)});

	// act
	try {
		await adapter.del('dogs');
	} catch (error) {
		// assert
		expect(error).toEqual(null);
	}
});

test('redis adapter should del [resolves]', async () => {
	// arrange
	expect.assertions(1);
	const adapter = new RedisAdapter({del: sinon.stub().withArgs('dogs').yields(undefined)});

	// act
	const result = await adapter.del('dogs');

	// assert
	expect(result).toBeTruthy();
});
