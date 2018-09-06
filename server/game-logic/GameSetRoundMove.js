module.exports = class GameSetRoundMove {
  constructor(playerId, playerTeamId, card) {
    this.playerId = playerId
    this.playerTeamId = playerTeamId
    this.card = card
  }

  toJSON() {
    return {
      playerId: this.playerId,
      playerTeamId: this.playerTeamId,
      card: this.card
    }
  }
}
