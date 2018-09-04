const GameSetRound = require('./GameSetRound')
const { flattenArray } = require('../../shared/utils/array')

module.exports = class GameSet {
  constructor(
    allPlayers,
    assetSuit,
    teamAPredictionPoints,
    teamBPredictionPoints,
    startingPlayerId
  ) {
    this.allPlayers = allPlayers

    this.assetSuit = assetSuit

    this.teamAPredictionPoints = teamAPredictionPoints
    this.teamBPredictionPoints = teamBPredictionPoints

    this.teamAPoints = 0
    this.teamBPoints = 0
    this.winningTeamId = null

    this.previousRounds = []
    this.currentRound = null

    this.nextRound(startingPlayerId)
  }

  nextRound(startingPlayerId) {
    if (this.currentRound !== null) {
      this.previousRounds.push(this.currentRound)
    }

    this.currentRound = new GameSetRound(this.assetSuit, startingPlayerId)
  }

  makeRoundMove(player, move) {
    if (!this.currentRound.makeMove(player, move)) {
      return false
    }

    player.removeCard(move.card)

    const wasLastMoveInRound = this.currentRound.moves.length === 4
    if (wasLastMoveInRound) {
      // Calculate who won and add points

      const wasLastRoundInSet = player.cards.length === 0
      if (wasLastRoundInSet) {
        // Calculate winning team of set + total points
      } else {
        setTimeout(() => this.nextRound(), 1000)
      }
    } else {
      const nextPlayerIndex = (player.index + 1) % 4
      const nextPlayer = this.allPlayers.find(
        player => player.index === nextPlayerIndex
      )
      this.currentRound.nextPlayerId = nextPlayer.id
    }

    return true
  }

  collectDeckOfCardsForNextSet() {
    const nestedCards = this.previousRounds
      .concat([this.currentRound])
      .map(round => round.moves.map(move => move.card))
    return flattenArray(nestedCards)
  }

  toJSON() {
    return {
      assetSuit: this.assetSuit,
      teamAPredictionPoints: this.teamAPredictionPoints,
      teamBPredictionPoints: this.teamBPredictionPoints,
      teamAPoints: this.teamAPoints,
      teamBPoints: this.teamBPoints,
      previousRounds: this.previousRounds.map(round => round.toJSON()),
      currentRound: this.currentRound.toJSON(),
      winningTeamId: this.winningTeamId
    }
  }
}
