const { isSameCard } = require('../../shared/utils/cards')

module.exports = class PlayerModel {
  constructor(socket, index) {
    this.socket = socket
    this.index = index

    this.id = this.socket.id

    this.setPredictionPoints = null
    this.setPredictionAssetSuit = null

    this.cards = []
  }

  resetSetPredictions() {
    this.setPredictionPoints = null
    this.setPredictionAssetSuit = null
  }

  hasCard(card) {
    return this.cards.some(myCard => isSameCard(card, myCard))
  }

  removeCard(card) {
    this.cards = this.cards.filter(myCard => !isSameCard(card, myCard))
  }

  toPublicJSON() {
    return {
      index: this.index,
      id: this.socket.id,
      setPredictionPoints: this.setPredictionPoints,
      setPredictionAssetSuit: this.setPredictionAssetSuit
    }
  }

  toPrivateJSON() {
    return {
      ...this.toPublicJSON(),
      cards: this.cards
    }
  }
}
