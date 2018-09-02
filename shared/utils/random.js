module.exports.randomIntInRange = (min, max) =>
  min + Math.floor(Math.random() * (max - min))

module.exports.randomInArray = array =>
  array[module.exports.randomIntInRange(0, array.length)]
