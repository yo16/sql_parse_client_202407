/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  //testEnvironment: "node",
  preset: 'ts-jest',
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  rootDir: './',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx)',  // __tests__ フォルダ内の .test.ts ファイルを対象にする
  ],
};
