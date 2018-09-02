const { EventEmitter } = require('events')
const GameEvents = require('../../shared/constants/GameEvents')
const { randomInArray } = require('../../shared/utils/random')
const log = require('../../log')(__filename)

const createGuid = () =>
  'xxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

module.exports = class MockPlayerSocket extends EventEmitter {
  constructor() {
    super()

    this.id = createGuid()

    log.debug('created', { id: this.id })

    this.on(GameEvents.GameState, gameState => {
      this.gameState = gameState

      if (gameState.currentRound.nextPlayerId === this.id) {
        setTimeout(() => this.makeAMove(gameState), 500)
      }
    })
  }

  makeAMove(gameState) {
    const roundsFirstMove = gameState.currentRound.moves[0]
    const roundSuit = roundsFirstMove ? roundsFirstMove.suit : null
    const cards = gameState.players.me.cards
    const cardToPlay =
      cards.find(card => card.suit === roundSuit) || randomInArray(cards)

    log.debug('making a move', {
      id: this.id,
      cardToPlay
    })

    this.emit(GameEvents.Move, {
      card: cardToPlay
    })
  }
}
