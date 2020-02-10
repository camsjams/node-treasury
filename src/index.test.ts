import sinon from 'sinon';
import Treasury from './index';

test('Treasury should construct', () => {
	// arrange
	const OPTIONS = {
		namespace: 'CUSTOM',
		ttl: 1001
	};

	// act
	const result = new Treasury(OPTIONS);

	// assert
	expect(result).toBeTruthy();
	expect(result.config.namespace).toEqual(OPTIONS.namespace);
	expect(result.config.ttl).toBeTruthy();
});

test('Treasury should divest [no options]', async () => {
	// arrange
	expect.assertions(1);
	const redisStub = {
		constructor: {
			name: 'RedisClient'
		},
		del: sinon.stub().withArgs('CUSTOM:99914b932bd37a50b983c5e7c90ae93b').yields()
	};
	const OPTIONS = {
		client: redisStub,
		namespace: 'CUSTOM',
		ttl: 1001
	};
	const treasury = new Treasury(OPTIONS);

	// act
	const result = await treasury.divest();

	// assert
	expect(result).toBeTruthy();
});

test('Treasury should divest [custom namespace]', async () => {
	// arrange
	expect.assertions(1);
	const redisStub = {
		constructor: {
			name: 'RedisClient'
		},
		del: sinon.stub().withArgs('cookies:99914b932bd37a50b983c5e7c90ae93b').yields()
	};
	const OPTIONS = {
		client: redisStub,
		namespace: 'CUSTOM',
		ttl: 1001
	};
	const treasury = new Treasury(OPTIONS);

	// act
	const result = await treasury.divest({namespace: 'cookies'});

	// assert
	expect(result).toBeTruthy();
});
