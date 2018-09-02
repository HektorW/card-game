module.exports = class PlayerModel {
  constructor(socket, index) {
    this.socket = socket
    this.index = index

    this.id = this.socket.id

    this.points = 0
    this.cards = []
  }

  hasCard(card) {
    return this.cards.some(myCard => myCard.isSame(card))
  }

  removeCard(card) {
    this.cards = this.cards.filter(myCard => !myCard.isSame(card))
  }

  toPublicJSON() {
    return {
      index: this.index,
      id: this.socket.id,
      points: this.points
    }
  }

  toPrivateJSON() {
    return {
      ...this.toPublicJSON(),
      cards: this.cards
    }
  }
}
