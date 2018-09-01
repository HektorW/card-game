const { join } = require('path')
const { createLogger } = require('bunyan')

function parseName(name) {
  // Assume this file is in the folder "$PROJECTROOT/log"
  const projectRoot = join(__dirname, '../')
  if (name.includes(projectRoot)) {
    name = name
      .replace(projectRoot, '')
      .replace('/index.js', '') // Only display folder name for index.js files
      .replace('.js', '')
  }
  return name
}

module.exports = function createApplicationLogger(name) {
  name = parseName(name)
  return createLogger({ name, level: 'trace' })
}
