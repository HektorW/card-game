module.exports = class PlayerModel {
  constructor(socket, index) {
    this.socket = socket
    this.index = index

    this.points = 0
    this.cards = []
  }

  toPublicJson() {
    return {
      index: this.index,
      id: this.socket.id,
      points: this.points
    }
  }

  toPrivateJson() {
    return {
      ...this.toPublicJson(),
      cards: this.cards
    }
  }
}
