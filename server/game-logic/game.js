const GameSet = require('./GameSet')
const GameEvents = require('../../shared/constants/GameEvents')
const Suites = require('../../shared/constants/Suites')
const {
  createDeckOfCards,
  shuffleDeckOfCards,
  dealCards
} = require('../../shared/utils/cards')
const { randomInArray } = require('../../shared/utils/random')
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
    const dealtCardArrays = dealCards(deckOfCards)

    dealtCardArrays.forEach(
      (cards, index) => (this.allPlayers[index].cards = cards)
    )

    this.currentSet = new GameSet(
      this.bothTeams,
      this.allPlayers,
      randomInArray(Object.values(Suites)),
      80,
      90,
      this.allPlayers[0].id
    )

    this.currentSet.on(GameSet.Events.StateUpdated, () =>
      this.sendGameStateToPlayers()
    )
  }

  listenToPlayerEvents() {
    this.allPlayers.forEach(player => {
      player.socket.on(GameEvents.Move, move => {
        this.handlePlayerMove(player, move)
      })
    })
  }

  handlePlayerMove(player, move) {
    this.log.debug('handling move request', {
      playerId: player.id,
      move
    })

    const validMove = this.currentSet.makeRoundMove(player, move)
    if (!validMove) {
      this.log.debug('move was denied for set', {
        playerId: player.id,
        move
      })
      return
    }

    this.sendGameStateToPlayers()
  }

  sendGameStateToPlayers() {
    this.allPlayers.forEach(player => {
      player.socket.emit(GameEvents.GameState, {
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
