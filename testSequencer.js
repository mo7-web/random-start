const Sequencer = require("@jest/test-sequencer").default
const sortTestFilePaths = [
  "pages/App.test.js",
]
class CustomSequencer extends Sequencer {
  sort(tests) {
    // 测试例排序
    const sortedTests = sortTestFilePaths
      .map((filePath) => {
        return tests.find((test) => test.path.endsWith(filePath))
      })
      .filter(Boolean)
    return [...new Set([...sortedTests, ...tests])]
  }
}

module.exports = CustomSequencer
