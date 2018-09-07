const { EventEmitter } = require('events')
const GameSetRound = require('./GameSetRound')
const { flattenArray } = require('../../shared/utils/array')
const { getPlayerTeam } = require('../../shared/utils/player')
const { getWinningMove, getRoundPoints } = require('../../shared/utils/round')

class GameSet extends EventEmitter {
  constructor(
    teams,
    allPlayers,
    assetSuit,
    teamAPredictionPoints,
    teamBPredictionPoints,
    startingPlayerId
  ) {
    super()

    this.teams = teams
    this.allPlayers = allPlayers

    this.assetSuit = assetSuit

    this.teamAPredictionPoints = teamAPredictionPoints
    this.teamBPredictionPoints = teamBPredictionPoints

    this.teamAPoints = 0
    this.teamBPoints = 0

    this.previousRounds = []
    this.currentRound = null

    this.nextRound(startingPlayerId)
  }

  nextRound(startingPlayerId) {
    if (this.currentRound !== null) {
      this.previousRounds.push(this.currentRound)
    }

    this.currentRound = new GameSetRound(this.assetSuit, startingPlayerId)

    this.emit(GameSet.Events.StateUpdated)
  }

  makeRoundMove(player, move) {
    const { currentRound } = this

    const playerTeamId = getPlayerTeam(this.teams, player.id)
    if (!currentRound.makeMove(player, playerTeamId, move)) {
      return false
    }

    player.removeCard(move.card)

    const wasLastMoveInRound = currentRound.moves.length === 4
    if (wasLastMoveInRound) {
      // Calculate who won and add points
      const winningMove = getWinningMove(this.assetSuit, currentRound.moves)
      const roundPoints = getRoundPoints(this.assetSuit, currentRound.moves)

      if (winningMove.teamId === 'a') {
        this.teamAPoints += roundPoints
      } else {
        this.teamBPoints += roundPoints
      }

      const wasLastRoundInSet = player.cards.length === 0
      if (wasLastRoundInSet) {
        // Calculate winning team of set + total points
      } else {
        setTimeout(() => this.nextRound(winningMove.playerId), 1000)
      }
    } else {
      const nextPlayerIndex = (player.index + 1) % 4
      const nextPlayer = this.allPlayers.find(
        player => player.index === nextPlayerIndex
      )
      currentRound.nextPlayerId = nextPlayer.id
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
      currentRound: this.currentRound.toJSON()
    }
  }
}

GameSet.Events = {
  StateUpdated: 'state-updated'
}

module.exports = GameSet
