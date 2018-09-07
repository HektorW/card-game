const Suites = require('../constants/Suites')
const Values = require('../constants/Values')
const { flattenArray } = require('./array')

module.exports.createDeckOfCards = () => {
  const suiteValues = Object.values(Suites)
  const valueValues = Object.values(Values)
  const nestedDeckOfCards = suiteValues.map(suit =>
    valueValues.map(value => ({ suit, value }))
  )
  return flattenArray(nestedDeckOfCards)
}

module.exports.shuffleDeckOfCards = deckOfCards => {
  let currentIndex = deckOfCards.length
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    const temporaryValue = deckOfCards[currentIndex]
    deckOfCards[currentIndex] = deckOfCards[randomIndex]
    deckOfCards[randomIndex] = temporaryValue
  }

  return deckOfCards
}

module.exports.dealCards = deckOfCards => {
  const dealArrays = [[], [], [], []]
  const dealAmounts = [3, 2, 3]

  dealAmounts.forEach(dealAmount => {
    dealArrays.forEach(array => {
      array.push(...deckOfCards.splice(0, dealAmount))
    })
  })

  return dealArrays
}

module.exports.isSameCard = (cardA, cardB) =>
  cardA.suit === cardB.suit && cardA.value === cardB.value

module.exports.cardNumberValue = (card, isAssetSuit) => {
  if (isAssetSuit) {
    switch (card.value) {
      case Values.Jack:
        return 20
      case Values.Nine:
        return 14
      case Values.Ace:
        return 11
      case Values.Ten:
        return 10
      case Values.King:
        return 4
      case Values.Queen:
        return 3
      case Values.Eight:
      case Values.Seven:
        return 0
    }
  } else {
    switch (card.value) {
      case Values.Ace:
        return 11
      case Values.Ten:
        return 10
      case Values.King:
        return 4
      case Values.Queen:
        return 3
      case Values.Jack:
        return 2
      case Values.Nine:
      case Values.Eight:
      case Values.Seven:
        return 0
    }
  }
}
