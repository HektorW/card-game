const { EventEmitter } = require('events')
const GameEvents = require('../../shared/constants/GameEvents')
const { isValidMove } = require('../../shared/utils/round')
const { getPlayerTeam } = require('../../shared/utils/player')
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
      const { currentSet } = gameState
      if (!currentSet) {
        return
      }

      const { currentRound } = currentSet
      if (!currentRound) {
        return
      }

      if (currentRound.nextPlayerId === this.id) {
        setTimeout(() => this.makeAMove(gameState), 500)
      }
    })
  }

  makeAMove(gameState) {
    const { currentSet, me, teamA, teamB } = gameState
    const { assetSuit, currentRound } = currentSet
    const { cards: myCards } = me

    const myTeam = getPlayerTeam([teamA, teamB], me.id)

    const cardToPlay = myCards.find(card =>
      isValidMove(assetSuit, currentRound.moves, myTeam.id, myCards, card)
    )

    if (!cardToPlay) {
      debugger
      log.error('failed to find a valid move', {
        id: this.id,
        myCards,
        currentRound,
        assetSuit
      })
      throw new Error('Failed to find a valid move')
    }

    log.debug('making a move', {
      id: this.id,
      cardToPlay
    })

    this.emit(GameEvents.Move, {
      card: cardToPlay
    })
  }
}
