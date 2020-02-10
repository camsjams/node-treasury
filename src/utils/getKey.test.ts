import getKey from './getKey';

test('should accept empty options', () => {
	// arrange

	// act
	const result = getKey();

	// assert
	expect(result).toEqual('Treasury:99914b932bd37a50b983c5e7c90ae93b');
});

test('should accept null options', () => {
	// arrange

	// act
	const result = getKey(null, null);

	// assert
	expect(result).toEqual('Treasury:99914b932bd37a50b983c5e7c90ae93b');
});

test('should accept full options', () => {
	// arrange

	// act
	const result = getKey({a: 1}, 'CustomNs');

	// assert
	expect(result).toEqual('CustomNs:bb6cb5c68df4652941caf652a366f2d8');
});

test('should get same key', () => {
	// arrange
	const randomKey = Math.random() * 10000 + '_random';
	const randomKey2 = Math.random() * 10000 + '_random2';
	const fpo = {
		a: randomKey,
		b: randomKey2,
		c: {d: true, q: 'qq'}
	};

	// act
	const expected = getKey(fpo, 'NS');
	const result = getKey(fpo, 'NS');

	// assert
	expect(result).toEqual(expected);
});
