module.exports = {
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json'
		}
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts)$': 'ts-jest'
	},
	testMatch: [
		'**/src/**/*.test.(ts|js)'
	],
	testEnvironment: 'node',
	collectCoverageFrom: [
		'**/src/**/*.(ts)'
	]
};
