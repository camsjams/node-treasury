const chai = require('chai');
const _rewire = require('rewire');

const Treasury = _rewire('../../index');

describe('Test cache key', testCacheKey);

function testCacheKey() {
	it('should accept empty options', emptyOpts);
	it('should accept null options', nullOpts);
	it('should accept full options', basicTest);
	it('should get same key', sameKey);

	function emptyOpts(done) {
		// arrange
		const getKey = Treasury.__get__('getKey');

		// act
		const result = getKey();

		// assert
		chai.assert.typeOf(result, 'String');
		chai.assert.equal(result, 'Treasury:99914b932bd37a50b983c5e7c90ae93b');

		done();
	}

	function nullOpts(done) {
		// arrange
		const getKey = Treasury.__get__('getKey');

		// act
		const result = getKey(null, null);

		// assert
		chai.assert.typeOf(result, 'String');
		chai.assert.equal(result, 'Treasury:99914b932bd37a50b983c5e7c90ae93b');

		done();
	}

	function basicTest(done) {
		// arrange
		const getKey = Treasury.__get__('getKey');

		// act
		const result = getKey({a: 1}, 'CustomNs');

		// assert
		chai.assert.typeOf(result, 'String');
		chai.assert.equal(result, 'CustomNs:bb6cb5c68df4652941caf652a366f2d8');

		done();
	}

	function sameKey(done) {
		// arrange
		const getKey = Treasury.__get__('getKey');
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
		chai.assert.typeOf(result, 'String');
		chai.assert.equal(result, expected);

		done();
	}
}
