const { EventEmitter } = require('events')
const GameSetRound = require('./GameSetRound')
const { flattenArray } = require('../../shared/utils/array')
const { dealCards } = require('../../shared/utils/cards')
const { getPlayerTeam, getNextPlayer } = require('../../shared/utils/player')
const { getWinningMove, getRoundPoints } = require('../../shared/utils/round')
const GameEvents = require('../../shared/constants/GameEvents')
const GameStates = require('../../shared/constants/GameStates')

class GameSet extends EventEmitter {
  constructor(teams, allPlayers, startingPlayerId, deckOfCards) {
    super()

    this.teams = teams
    this.allPlayers = allPlayers
    this.startingPlayerId = startingPlayerId

    this.assetSuit = null

    this.teamAPredictionPoints = null
    this.teamBPredictionPoints = null

    this.teamAPoints = 0
    this.teamBPoints = 0

    this.previousRounds = []
    this.currentRound = null

    this.nextPredictionPlayerId = this.startingPlayerId
    this.currentState = GameStates.Set.Predicitions

    this.bindPlayerEvents()

    this.resetPlayerSetPredicitions()
    this.dealCards(deckOfCards)
  }

  destroy() {
    this.allPlayers.forEach(player => {
      player.socket.off(GameEvents.Client.SetPrediction)
      player.socket.off(GameEvents.Client.SetPredictionCounter)
      player.socket.off(GameEvents.Client.RoundMove)
    })
  }

  bindPlayerEvents() {
    this.allPlayers.forEach(player => {
      player.socket.on(
        GameEvents.Client.SetPrediction,
        this.onPlayerSetPrediction.bind(this, player)
      )
      player.socket.on(
        GameEvents.Client.SetPredictionCounter,
        this.onPlayerSetPredictionCounter.bind(this, player)
      )
      player.socket.on(
        GameEvents.Client.RoundMove,
        this.onPlayerRoundMove.bind(this, player)
      )
    })
  }

  resetPlayerSetPredicitions() {
    this.allPlayers.forEach(player => {
      player.resetSetPredictions()
    })
  }

  dealCards(deckOfCards) {
    const dealtCardArrays = dealCards(deckOfCards)

    dealtCardArrays.forEach(
      (cards, index) => (this.allPlayers[index].cards = cards)
    )
  }

  nextRound(startingPlayerId) {
    if (this.currentRound !== null) {
      this.previousRounds.push(this.currentRound)
    }

    this.currentRound = new GameSetRound(this.assetSuit, startingPlayerId)

    this.emit(GameSet.Events.StateUpdated)
  }

  onPlayerSetPrediction(player, prediction) {
    if (this.currentState !== GameStates.Set.Predicitions) {
      return
    }

    if (player.id !== this.nextPredictionPlayerId) {
      return
    }

    player.setPredictionPoints = prediction.points
    player.setPredictionAssetSuit = prediction.assetSuit

    this.nextPredictionPlayerId = getNextPlayer(this.allPlayers, player.id)

    this.emit(GameSet.Events.StateUpdated)
  }

  onPlayerSetPredictionCounter(player, predictionToCounter) {}

  onPlayerRoundMove(player, move) {
    if (this.makeRoundMove(player, move)) {
      this.emit(GameSet.Events.StateUpdated)
    }
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
      const nextPlayer = getNextPlayer(this.allPlayers, player.id)
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
      currentState: this.currentState,
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
