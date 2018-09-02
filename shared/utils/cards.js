const Suites = require('../constants/Suites')
const Values = require('../constants/Values')
const Card = require('../models/Card')
const { flattenArray } = require('./array')

module.exports.createDeckOfCards = () => {
  const suiteValues = Object.values(Suites)
  const valueValues = Object.values(Values)
  const nestedDeckOfCards = suiteValues.map(suit =>
    valueValues.map(value => new Card(suit, value))
  )
  return flattenArray(nestedDeckOfCards)
}

module.exports.cardNumberValue = card =>
  card.value === Values.Ace ? 15 : Object.values(Values).indexOf(card.value) + 1
