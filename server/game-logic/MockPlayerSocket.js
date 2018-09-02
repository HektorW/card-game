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

    this.on(GameEvents.GameState, gamestate => {
      this.gamestate = gamestate

      if (gamestate.currentRound.nextPlayerId === this.id) {
        this.makeAMove()
      }
    })
  }

  makeAMove() {
    const cards = this.gamestate.players.me.cards
    const cardToPlay = randomInArray(cards)

    log.debug('making a move', {
      id: this.id,
      cardToPlay
    })

    this.emit(GameEvents.Move, {
      card: cardToPlay
    })
  }
}
