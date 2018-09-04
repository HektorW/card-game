module.exports = class Team {
  constructor(id, players) {
    this.id = id
    this.players = players

    this.points = 0

    players[0].teamId = id
    players[1].teamId = id
  }

  toJSON() {
    return {
      id: this.id,
      players: this.players.map(player => player.toPrivateJSON()),
      points: this.points
    }
  }
}
