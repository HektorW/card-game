const GameSet = require('./GameSet')
const GameEvents = require('../../shared/constants/GameEvents')
const {
  createDeckOfCards,
  shuffleDeckOfCards
} = require('../../shared/utils/cards')
const { createGameId } = require('./game-id')
const createLog = require('../../log')

module.exports = class Game {
  constructor(teamA, teamB) {
    this.id = createGameId()
    this.log = createLog(`game-${this.id}`)

    this.log.debug('starting new game')

    this.teamA = teamA
    this.teamB = teamB

    this.allPlayers = [...teamA.players, ...teamB.players]
    this.bothTeams = [teamA, teamB]

    this.previousSets = []
    this.currentSet = null

    this.setupFirstSet()

    this.listenToPlayerEvents()
    this.sendGameStateToPlayers()
  }

  setupFirstSet() {
    const deckOfCards = shuffleDeckOfCards(createDeckOfCards())

    this.currentSet = new GameSet(
      this.bothTeams,
      this.allPlayers,
      this.allPlayers[0].id,
      deckOfCards
    )

    this.currentSet.on(GameSet.Events.StateUpdated, () =>
      this.sendGameStateToPlayers()
    )
  }

  listenToPlayerEvents() {
    this.allPlayers.forEach(player => {})
  }

  sendGameStateToPlayers() {
    this.allPlayers.forEach(player => {
      player.socket.emit(GameEvents.Server.GameState, {
        gameId: this.id,
        winnerId: this.winnerId,
        previousSets: this.previousSets.map(set => set.toJSON()),
        currentSet: this.currentSet.toJSON(),
        teamA: this.teamA.toJSON(),
        teamB: this.teamB.toJSON(),
        me: player.toPrivateJSON()
      })
    })
  }

  getDebugGameState() {
    return {
      gameId: this.id,
      winnerId: this.winnerId,
      previousSets: this.previousSets.map(set => set.toJSON()),
      currentSet: this.currentSet.toJSON(),
      teamA: this.teamA.toJSON(),
      teamB: this.teamB.toJSON(),
      players: this.allPlayers.map(player => player.toPrivateJSON())
    }
  }
}
