module.exports = {
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json'
		}
	},
	coveragePathIgnorePatterns: [
		'!*.d.ts'
	],
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: [
		'**/src/**/*.test.(ts|js)'
	],
	testEnvironment: 'node',
	collectCoverageFrom: [
		'**/src/**/*.(ts)'
	]
};
