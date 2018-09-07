const { isValidMove } = require('../../shared/utils/round')
const GameSetRoundMove = require('./GameSetRoundMove')
const log = require('../../log')(__filename)

module.exports = class GameSetRound {
  constructor(assetSuit, startingPlayerId) {
    this.assetSuit = assetSuit
    this.nextPlayerId = startingPlayerId
    this.moves = []
  }

  makeMove(player, playerTeamId, move) {
    if (this.moves.length === 4) {
      log.debug('tried to make a move when there already is 4', {
        player,
        playerTeamId,
        move,
        moves: this.moves
      })
      return false
    }

    if (player.id !== this.nextPlayerId) {
      return false
    }

    if (
      !isValidMove(
        this.assetSuit,
        this.moves,
        playerTeamId,
        player.cards,
        move.card
      )
    ) {
      return false
    }

    this.moves.push(new GameSetRoundMove(player.id, playerTeamId, move.card))

    return true
  }

  toJSON() {
    return {
      nextPlayerId: this.nextPlayerId,
      moves: this.moves.map(move => move.toJSON())
    }
  }
}
