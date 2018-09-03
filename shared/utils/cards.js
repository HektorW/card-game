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

module.exports.isValidMove = (assetSuit, roundCards, playerCards, moveCard) => {
  const cardIsInPlayerCards = playerCards.some(card =>
    module.exports.isSameCard(card, moveCard)
  )
  if (!cardIsInPlayerCards) {
    return false
  }

  if (roundCards.length > 0) {
    const isAssetCardInRound = roundCards.some(card => card.suit === assetSuit)
    const playerAssetCards = playerCards.filter(card => card.suit === assetSuit)

    if (isAssetCardInRound && playerAssetCards.length > 0) {
      const highestPlayerAssetCard = playerAssetCards.reduce(
        (currentHighestCard, card) =>
          module.exports.cardNumberValue(card, true) >
          module.exports.cardNumberValue(currentHighestCard)
            ? card
            : currentHighestCard
      )

      if (!module.exports.isSameCard(highestPlayerAssetCard, moveCard)) {
        return false
      }
    }

    const firstCardSuitInRound = roundCards[0].suit
    const playerCardsWithSuit = playerCards.some(
      card => card.suit === firstCardSuitInRound
    )
    if (
      playerCardsWithSuit.length > 0 &&
      moveCard.suit !== firstCardSuitInRound
    ) {
      return false
    }
  }

  return true
}

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
