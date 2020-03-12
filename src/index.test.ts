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

test('Treasury should invest [with cache, no options]', async () => {
	// arrange
	expect.assertions(4);
	const EXPECTED = {dogs: true, andCats: true};
	const somePromise = sinon.stub().resolves(EXPECTED);
	const redisStub = {
		constructor: {
			name: 'RedisClient'
		},
		get: sinon.stub().withArgs('INVEST:99914b932bd37a50b983c5e7c90ae93b').yields(null, JSON.stringify(EXPECTED)),
		setex: sinon.stub().yields()
	};
	const OPTIONS = {
		client: redisStub,
		namespace: 'INVEST',
		ttl: 1001
	};
	const treasury = new Treasury(OPTIONS);

	// act
	const result = await treasury.invest(somePromise);

	// assert
	expect(result).toEqual(EXPECTED);
	expect(somePromise.notCalled).toBeTruthy();
	expect(redisStub.get.calledOnce).toBeTruthy();
	expect(redisStub.setex.notCalled).toBeTruthy();
});

test('Treasury should invest [no cache, no options]', async () => {
	// arrange
	expect.assertions(4);
	const EXPECTED = {dogs: true, andCats: true};
	const somePromise = sinon.stub().resolves(EXPECTED);
	const redisStub = {
		constructor: {
			name: 'RedisClient'
		},
		get: sinon.stub().withArgs('INVEST:99914b932bd37a50b983c5e7c90ae93b').yields(undefined, null),
		setex: sinon.stub().withArgs('INVEST:99914b932bd37a50b983c5e7c90ae93b', JSON.stringify(EXPECTED), 1001).yields()
	};
	const OPTIONS = {
		client: redisStub,
		namespace: 'INVEST',
		ttl: 1001
	};
	const treasury = new Treasury(OPTIONS);

	// act
	const result = await treasury.invest(somePromise);

	// assert
	expect(result).toEqual(EXPECTED);
	expect(somePromise.calledOnce).toBeTruthy();
	expect(redisStub.get.calledOnce).toBeTruthy();
	expect(redisStub.setex.calledOnce).toBeTruthy();
});

test('Treasury should invest [custom namespace]', async () => {
	// arrange
	expect.assertions(5);
	const EXPECTED = {dogs: true, andCats: true};
	const somePromise = sinon.stub().resolves(EXPECTED);
	const PARAMS = {namespace: 'cookies'};
	const redisStub = {
		constructor: {
			name: 'RedisClient'
		},
		get: sinon.stub().withArgs('cookies:99914b932bd37a50b983c5e7c90ae93b').yields(undefined, null),
		setex: sinon.stub().withArgs('cookies:99914b932bd37a50b983c5e7c90ae93b', JSON.stringify(EXPECTED), 10).yields()
	};
	const OPTIONS = {
		client: redisStub,
		namespace: 'INVEST',
		ttl: 10
	};
	const treasury = new Treasury(OPTIONS);

	// act
	const result = await treasury.invest(somePromise, PARAMS);

	// assert
	expect(result).toEqual(EXPECTED);
	expect(somePromise.calledOnce).toBeTruthy();
	expect(somePromise.calledWith(PARAMS)).toBeTruthy();
	expect(redisStub.get.calledOnce).toBeTruthy();
	expect(redisStub.setex.calledOnce).toBeTruthy();
});

test('Treasury should invest [custom ttl]', async () => {
	// arrange
	expect.assertions(5);
	const EXPECTED = {dogs: true, andCats: true};
	const somePromise = sinon.stub().resolves(EXPECTED);
	const PARAMS = {ttl: 443};
	const redisStub = {
		constructor: {
			name: 'RedisClient'
		},
		get: sinon.stub().withArgs('INVEST:99914b932bd37a50b983c5e7c90ae93b').yields(undefined, null),
		setex: sinon.stub().withArgs('INVEST:99914b932bd37a50b983c5e7c90ae93b', JSON.stringify(EXPECTED), 443).yields()
	};
	const OPTIONS = {
		client: redisStub,
		namespace: 'INVEST',
		ttl: 10
	};
	const treasury = new Treasury(OPTIONS);

	// act
	const result = await treasury.invest(somePromise, PARAMS);

	// assert
	expect(result).toEqual(EXPECTED);
	expect(somePromise.calledOnce).toBeTruthy();
	expect(somePromise.calledWith(PARAMS)).toBeTruthy();
	expect(redisStub.get.calledOnce).toBeTruthy();
	expect(redisStub.setex.calledOnce).toBeTruthy();
});

test('Treasury should invest [parameters in options]', async () => {
	// arrange
	expect.assertions(5);
	const EXPECTED = {dogs: true, andCats: true};
	const somePromise = sinon.stub().resolves(EXPECTED);
	const PARAMS = {id: 1337};
	const redisStub = {
		constructor: {
			name: 'RedisClient'
		},
		get: sinon.stub().withArgs('INVEST:99914b932bd37a50b983c5e7c90ae93b').yields(undefined, null),
		setex: sinon.stub().withArgs('INVEST:99914b932bd37a50b983c5e7c90ae93b', JSON.stringify(EXPECTED), 443).yields()
	};
	const OPTIONS = {
		client: redisStub,
		namespace: 'INVEST',
		ttl: 10
	};
	const treasury = new Treasury(OPTIONS);

	// act
	const result = await treasury.invest(somePromise, PARAMS);

	// assert
	expect(result).toEqual(EXPECTED);
	expect(somePromise.calledOnce).toBeTruthy();
	expect(somePromise.calledWith(PARAMS)).toBeTruthy();
	expect(redisStub.get.calledOnce).toBeTruthy();
	expect(redisStub.setex.calledOnce).toBeTruthy();
});

test('Treasury should invest [complex parameters in options]', async () => {
	// arrange
	expect.assertions(5);
	const EXPECTED = {dogs: true, andCats: true};
	const somePromise = sinon.stub().resolves(EXPECTED);
	const PARAMS = {user: {id: 1234}};
	const redisStub = {
		constructor: {
			name: 'RedisClient'
		},
		get: sinon.stub().withArgs('INVEST:99914b932bd37a50b983c5e7c90ae93b').yields(undefined, null),
		setex: sinon.stub().withArgs('INVEST:99914b932bd37a50b983c5e7c90ae93b', JSON.stringify(EXPECTED), 443).yields()
	};
	const OPTIONS = {
		client: redisStub,
		namespace: 'INVEST',
		ttl: 10
	};
	const treasury = new Treasury(OPTIONS);

	// act
	const result = await treasury.invest(somePromise, PARAMS);

	// assert
	expect(result).toEqual(EXPECTED);
	expect(somePromise.calledOnce).toBeTruthy();
	expect(somePromise.calledWith(PARAMS)).toBeTruthy();
	expect(redisStub.get.calledOnce).toBeTruthy();
	expect(redisStub.setex.calledOnce).toBeTruthy();
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
