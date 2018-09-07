module.exports = class GameSetRoundMove {
  constructor(playerId, teamId, card) {
    this.playerId = playerId
    this.teamId = teamId
    this.card = card
  }

  toJSON() {
    return {
      playerId: this.playerId,
      teamId: this.teamId,
      card: this.card
    }
  }
}
