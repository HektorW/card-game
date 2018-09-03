const { isValidMove } = require('../../shared/utils/cards')
const GameSetRoundMove = require('./GameSetRoundMove')

module.exports = class GameSetRound {
  constructor(assetSuit, startingPlayerId) {
    this.nextPlayerId = startingPlayerId
    this.moves = []
  }

  makeMove(player, move) {
    if (this.moves.length === 4) {
      throw new Error('Round already has 4 moves')
    }

    if (player.id !== this.nextPlayerId) {
      return false
    }

    const roundCards = this.moves.map(move => move.card)
    if (!isValidMove(this.assetSuit, roundCards, player.cards, move.card)) {
      return false
    }

    this.moves.push(new GameSetRoundMove(player.id, move.card))

    return true
  }

  toJSON() {
    return {
      nextPlayerId: this.nextPlayerId,
      moves: this.moves
    }
  }
}
