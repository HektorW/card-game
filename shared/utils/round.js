const { isSameCard, cardNumberValue } = require('./cards')

module.exports.isValidMove = (
  assetSuit,
  roundMoves,
  playerTeamId,
  playerCards,
  moveCard
) => {
  const cardIsInPlayerCards = playerCards.some(card =>
    isSameCard(card, moveCard)
  )
  if (!cardIsInPlayerCards) {
    return false
  }

  // If the round doesn't have any moves, everything is valid
  if (roundMoves.length > 0) {
    const firstCardSuitInRound = roundMoves[0].card.suit

    if (moveCard.suit !== firstCardSuitInRound) {
      // Must always play same suit as first card if we have it
      const playerCardsWithSuit = playerCards.filter(
        card => card.suit === firstCardSuitInRound
      )
      if (playerCardsWithSuit.length > 0) {
        return false
      }

      const enemyTeamMoves = roundMoves.filter(
        move => move.teamId !== playerTeamId
      )
      const hasEnemyPlayedAssetSuit = enemyTeamMoves.some(
        move => move.card.suit === assetSuit
      )

      const playerAssetSuitCards = playerCards.filter(
        card => card.suit === assetSuit
      )

      if (hasEnemyPlayedAssetSuit && playerAssetSuitCards.length > 0) {
        // If enemy has played asset suit we must play that if we have it
        if (moveCard.suit !== assetSuit) {
          return false
        }

        const highestAssetSuitCardPlayedByEnemy = enemyTeamMoves.reduce(
          (currentHighestCard, move) =>
            cardNumberValue(move.card, true) >
            cardNumberValue(currentHighestCard, true)
              ? move.card
              : currentHighestCard,
          enemyTeamMoves[0].card
        )

        const playerAssetSuitCardsHigherThanEnemt = playerAssetSuitCards.filter(
          card =>
            cardNumberValue(card, true) >
            cardNumberValue(highestAssetSuitCardPlayedByEnemy, true)
        )

        const isMoveCardHigherThanEnemy =
          cardNumberValue(moveCard, true) >
          cardNumberValue(highestAssetSuitCardPlayedByEnemy, true)

        // We must play a higher asset suit card if we have it
        if (
          playerAssetSuitCardsHigherThanEnemt.length > 0 &&
          !isMoveCardHigherThanEnemy
        ) {
          return false
        }
      }
    }
  }

  return true
}

module.exports.getWinningMove = (assetSuit, roundMoves) => {
  const roundSuit = roundMoves[0].card.suit
  const isAssetSuit = roundSuit === assetSuit

  return roundMoves
    .filter(move => move.card.suit === roundSuit)
    .reduce(
      (currentHighestMove, move) =>
        cardNumberValue(move.card, isAssetSuit) >
        cardNumberValue(currentHighestMove.card, isAssetSuit)
          ? move
          : currentHighestMove
    )
}

module.exports.getRoundPoints = (assetSuit, roundMoves) =>
  roundMoves.reduce(
    (total, move) => cardNumberValue(move.card, move.card.suit === assetSuit),
    0
  )
