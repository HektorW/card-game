module.exports = class Team {
  constructor(id, players) {
    this.id = id
    this.players = players

    this.points = 0
  }

  toJSON() {
    return {
      id: this.id,
      players: this.players.map(player => player.toPublicJSON()),
      points: this.points
    }
  }
}
