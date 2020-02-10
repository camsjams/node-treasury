import getCleanedOptions from './getCleanedOptions';

test('should accept undefined options', () => {
	// arrange

	// act
	const result = getCleanedOptions();

	// assert
	expect(result.ttl).toEqual(300);
	expect(result.namespace).toEqual('Treasury');
});

test('should accept null options', () => {
	// arrange

	// act
	const result = getCleanedOptions(null);

	// assert
	expect(result.ttl).toEqual(300);
	expect(result.namespace).toEqual('Treasury');
});

test('should accept empty options', () => {
	// arrange

	// act
	const result = getCleanedOptions({});

	// assert
	expect(result.ttl).toEqual(300);
	expect(result.namespace).toEqual('Treasury');
});

test('should accept a ttl', () => {
	// arrange

	// act
	const result = getCleanedOptions({ttl: 1337});

	// assert
	expect(result.ttl).toEqual(1337);
});

test('should accept a namespace', () => {
	// arrange

	// act
	const result = getCleanedOptions({namespace: 'ScroogeMcDuck'});

	// assert
	expect(result.namespace).toEqual('ScroogeMcDuck');

});

test('should accept a client', () => {
	// arrange

	const myFakeClient = (): object => ({});

	// act
	const result = getCleanedOptions({client: myFakeClient});

	// assert
	expect(result.client).toEqual(myFakeClient);
});
