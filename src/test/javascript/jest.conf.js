module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/src/test/javascript/jest.ts'],
    coverageDirectory: '<rootDir>/target/test-results/',
    globals: {
        'ts-jest': {
            tsConfigFile: 'tsconfig.json'
        },
        __TRANSFORM_HTML__: true
    },
    moduleNameMapper: {
        'app/(.*)': '<rootDir>/src/main/webapp/app/$1'
    },
    reporters: [
        'default'
    ],
    testResultsProcessor: 'jest-sonar-reporter',
    transformIgnorePatterns: ['node_modules/(?!@angular/common/locales)'],
    testMatch: ['**/*/src/test/javascript/spec/**/+(*.)+(spec.ts)'],
    rootDir: '../../../'
};
