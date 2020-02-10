import chai from 'chai';
import getCleanedOptions from './getCleanedOptions';

test('should accept undefined options', () => {
	// arrange

	// act
	const result = getCleanedOptions();

	// assert
	chai.assert.typeOf(result, 'Object');
	chai.assert.typeOf(result.client, 'Null');
	chai.assert.equal(result.ttl, 300);
	chai.assert.equal(result.namespace, 'Treasury');
});

test('should accept null options', () => {
	// arrange

	// act
	const result = getCleanedOptions(null);

	// assert
	chai.assert.typeOf(result, 'Object');
	chai.assert.typeOf(result.client, 'Null');
	chai.assert.equal(result.ttl, 300);
	chai.assert.equal(result.namespace, 'Treasury');
});

test('should accept empty options', () => {
	// arrange

	// act
	const result = getCleanedOptions({});

	// assert
	chai.assert.typeOf(result, 'Object');
	chai.assert.typeOf(result.client, 'Null');
	chai.assert.equal(result.ttl, 300);
	chai.assert.equal(result.namespace, 'Treasury');
});

test('should accept a ttl', () => {
	// arrange

	// act
	const result = getCleanedOptions({ttl: 1337});

	// assert
	chai.assert.typeOf(result, 'Object');
	chai.assert.equal(result.ttl, 1337);

});

test('should accept a namespace', () => {
	// arrange

	// act
	const result = getCleanedOptions({namespace: 'ScroogeMcDuck'});

	// assert
	chai.assert.typeOf(result, 'Object');
	chai.assert.equal(result.namespace, 'ScroogeMcDuck');

});

test('should accept a client', () => {
	// arrange

	const myFakeClient = (): object => ({});

	// act
	const result = getCleanedOptions({client: myFakeClient});

	// assert
	chai.assert.typeOf(result, 'Object');
	chai.assert.typeOf(result.client, 'Object');
	chai.assert.deepEqual(result.client, myFakeClient);
});
