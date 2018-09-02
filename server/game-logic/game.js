const GameEvents = require('../../shared/constants/GameEvents')
const { arrayOfLength } = require('../../shared/utils/array')
const { createDeckOfCards } = require('../../shared/utils/cards')
const { randomIntInRange } = require('../../shared/utils/random')
const PlayerModel = require('./PlayerModel')
const { createGameId } = require('./game-id')
const createLog = require('../../log')

module.exports = class Game {
  constructor(sockets) {
    this.id = createGameId()
    this.log = createLog(`game-${this.id}`)

    if (!sockets.length === 4) {
      this.log.error('Could not start game because wrong number of sockets', {
        sockets
      })
      throw new Error('Game neeed 4 sockets to start')
    }

    this.players = sockets.map(
      (socket, index) => new PlayerModel(socket, index)
    )
    this.previousRounds = []
    this.currentRound = this.createRound(this.players[0].id)

    this.assignStartCards()
    this.listenToPlayerEvents()
    this.sendGameStateToPlayers()
  }

  assignStartCards() {
    const deckOfCards = createDeckOfCards()
    const numberOfCardsEach = 8

    this.players.forEach(player => {
      player.cards = arrayOfLength(numberOfCardsEach).map(() => {
        const randomCardIndex = randomIntInRange(0, deckOfCards.length)
        const randomCard = deckOfCards[randomCardIndex]

        deckOfCards.splice(randomCardIndex, 1)

        return randomCard
      })
    })
  }

  listenToPlayerEvents() {
    this.players.forEach(player => {
      player.socket.on(GameEvents.Move, move => {
        this.handlePlayerMove(player, move)
      })
    })
  }

  sendGameStateToPlayers() {
    this.players.forEach(player => {
      const otherPlayers = this.players.filter(
        otherPlayer => otherPlayer !== player
      )

      player.socket.emit(GameEvents.GameState, {
        gameId: this.id,
        previousRounds: this.previousRounds,
        currentRound: this.currentRound,
        players: {
          others: otherPlayers.map(otherPlayer => otherPlayer.toPublicJSON()),
          me: player.toPrivateJSON()
        }
      })
    })
  }

  createRound(startingPlayerId) {
    return {
      nextPlayerId: startingPlayerId,
      moves: []
    }
  }

  handlePlayerMove(player, move) {
    const { currentRound } = this

    this.log.debug('handling move request', {
      playerId: player.id,
      move
    })

    if (currentRound.nextPlayerId !== player.id) {
      this.log.debug('wrong player tried to make a move', {
        nextPlayerId: this.nextPlayer.id,
        playerId: player.id
      })
      return
    }

    if (!player.hasCard(move.card)) {
      this.log.debug('player tried to play invalid card', {
        playerId: player.id,
        playerCards: player.cards,
        move
      })
      return
    }

    currentRound.moves.push({
      playerId: player.id,
      card: move.card
    })

    player.removeCard(move.card)

    if (currentRound.moves.length === 4) {
      this.finishRound()
    } else {
      const nextPlayerIndex = (player.index + 1) % 4
      const nextPlayer = this.players[nextPlayerIndex]
      currentRound.nextPlayerId = nextPlayer.id
    }

    this.sendGameStateToPlayers()
  }

  finishRound() {
    const { currentRound } = this
    this.log.debug('finishing round', { round: currentRound })

    const roundWinnerId = this.getRoundWinnerId(currentRound)
    const winningPlayer = this.players.find(
      player => player.id === roundWinnerId
    )

    const roundScore = this.calculateRoundScore(currentRound)

    this.log.debug('winner of round', {
      roundWinnerId,
      roundScore
    })

    winningPlayer.score += roundScore

    const hasMoreCards = winningPlayer.cards.length > 0
    if (hasMoreCards) {
      this.previousRounds.push(currentRound)
      this.currentRound = this.createRound(winningPlayer.id)
    } else {
      this.finishGame()
    }
  }

  finishGame() {
    this.log.debug('finishing game')
  }

  getRoundWinnerId(round) {
    const validSuit = round.moves[0].card.suit
    const movesWithValidSuit = round.moves.filter(
      move => move.card.suit === validSuit
    )
    const moveWithHighestValue = movesWithValidSuit.reduce(
      (currentHighestMove, move) =>
        move.card.value > currentHighestMove.card.value
    )
    return moveWithHighestValue.playerId
  }

  calculateRoundScore(round) {
    return 1
  }
}
