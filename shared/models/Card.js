module.exports = class Card {
  constructor(suit, value) {
    this.suit = suit
    this.value = value
  }

  isSame(otherCard) {
    return this.suit === otherCard.suit && this.value === otherCard.value
  }

  toJSON() {
    return {
      suit: this.suit,
      value: this.value
    }
  }
}
