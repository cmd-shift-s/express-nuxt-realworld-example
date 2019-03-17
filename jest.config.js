module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  setupFiles: [
    '<rootDir>/node_modules/reflect-metadata',
    '<rootDir>/test/setup.ts'
  ],
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  testRegex: '(test|spec)\\.tsx?$',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest'
  }
}
