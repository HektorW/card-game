module.exports = class Team {
  constructor(id, players) {
    this.id = id
    this.players = 0
    this.points = 0

    players[0].teamId = id
    players[1].teamId = id
  }

  toJSON() {
    return {
      id: this.id,
      players: this.players,
      points: this.points
    }
  }
}
