var assert = require('assert');
var Treasury = require('../../index');

describe('Test supported options', testOptions);

function testOptions() {
    describe('#testBadInput', testBadInput);

    function testBadInput() {

        it('should have accepted undefined options', undefOpts);
        it('should have accepted null options', nullOpts);
        it('should have accepted empty options', emptyOpts);

        function undefOpts(done) {
            // arrange
            new Treasury();
            // act
            // assert
            done();
        }

        function nullOpts(done) {
            // arrange
            new Treasury(null);
            // act
            // assert
            done();
        }

        function emptyOpts(done) {
            // arrange
            new Treasury({});
            // act
            // assert
            done();
        }

    }
}