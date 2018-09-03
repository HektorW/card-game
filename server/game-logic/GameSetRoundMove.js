module.exports = class GameSetRoundMove {
  constructor(playerId, card) {
    this.playerId = playerId
    this.card = card
  }

  toJSON() {
    return {
      playerId: this.playerId,
      card: this.card
    }
  }
}
