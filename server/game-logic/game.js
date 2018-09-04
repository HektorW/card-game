const GameSet = require('./GameSet')
const GameEvents = require('../../shared/constants/GameEvents')
const Suites = require('../../shared/constants/Suites')
const {
  createDeckOfCards,
  shuffleDeckOfCards,
  dealCards
} = require('../../shared/utils/cards')
const { randomInArray } = require('../../shared/utils/random')
const { createGameId } = require('./game-id')
const createLog = require('../../log')

module.exports = class Game {
  constructor(teamA, teamB) {
    this.id = createGameId()
    this.log = createLog(`game-${this.id}`)

    this.log.debug('starting new game')

    this.teamA = teamA
    this.teamB = teamB
    this.allPlayers = [...teamA.players, ...teamB.players]

    this.previousSets = []
    this.currentSet = null

    this.setupFirstSet()

    this.listenToPlayerEvents()
    this.sendGameStateToPlayers()
  }

  setupFirstSet() {
    const deckOfCards = shuffleDeckOfCards(createDeckOfCards())
    const dealtCardArrays = dealCards(deckOfCards)

    dealtCardArrays.forEach(
      (cards, index) => (this.allPlayers[index].cards = cards)
    )

    this.currentSet = new GameSet(
      this.allPlayers,
      randomInArray(Object.values(Suites)),
      80,
      90,
      this.allPlayers[0].id
    )
  }

  listenToPlayerEvents() {
    this.allPlayers.forEach(player => {
      player.socket.on(GameEvents.Move, move => {
        this.handlePlayerMove(player, move)
      })
    })
  }

  handlePlayerMove(player, move) {
    this.log.debug('handling move request', {
      playerId: player.id,
      move
    })

    if (!this.currentSet.makeRoundMove(player, move)) {
      this.log.debug('move was denied for set', {
        playerId: player.id,
        move
      })
      return
    }

    this.sendGameStateToPlayers()

    // const { currentRound } = this
    // this.log.debug('handling move request', {
    //   playerId: player.id,
    //   move
    // })
    // if (currentRound.nextPlayerId !== player.id) {
    //   this.log.debug('wrong player tried to make a move', {
    //     nextPlayerId: this.nextPlayer.id,
    //     playerId: player.id
    //   })
    //   return
    // }
    // if (!isValidMove())) {
    //   this.log.debug('player tried to play invalid card', {
    //     playerId: player.id,
    //     playerCards: player.cards,
    //     move
    //   })
    //   return
    // }
    // currentRound.moves.push({
    //   playerId: player.id,
    //   card: move.card
    // })
    // player.removeCard(move.card)
    // if (currentRound.moves.length === 4) {
    //   currentRound.nextPlayerId = null
    //   setTimeout(() => this.finishRound(), 1000)
    // } else {
    //   const nextPlayerIndex = (player.index + 1) % 4
    //   const nextPlayer = this.allPlayers[nextPlayerIndex]
    //   currentRound.nextPlayerId = nextPlayer.id
    // }
    // this.sendGameStateToPlayers()
  }

  finishRound() {
    // const { currentRound } = this
    // this.log.debug('finishing round', { round: currentRound })
    // const roundWinnerId = this.getRoundWinnerId(currentRound)
    // const winningPlayer = this.allPlayers.find(
    //   player => player.id === roundWinnerId
    // )
    // const roundScore = this.calculateRoundScore(currentRound)
    // this.log.debug('winner of round', {
    //   roundWinnerId,
    //   roundScore
    // })
    // winningPlayer.points += roundScore
    // const hasMoreCards = winningPlayer.cards.length > 0
    // if (hasMoreCards) {
    //   this.previousRounds.push(currentRound)
    //   this.currentRound = this.createRound(winningPlayer.id)
    // } else {
    //   this.finishGame()
    // }
    // this.sendGameStateToPlayers()
  }

  finishGame() {
    // const winner = this.allPlayers.reduce(
    //   (currentBestPlayer, player) =>
    //     player.points > currentBestPlayer.points ? player : currentBestPlayer
    // )
    // this.winnerId = winner.id
    // this.log.debug('finished game', { winnerId: this.winnerId })
    // this.sendGameStateToPlayers()
  }

  getRoundWinnerId(round) {
    // const validSuit = round.moves[0].card.suit
    // const movesWithValidSuit = round.moves.filter(
    //   move => move.card.suit === validSuit
    // )
    // const moveWithHighestValue = movesWithValidSuit.reduce(
    //   (currentHighestMove, move) =>
    //     cardNumberValue(move.card) > cardNumberValue(currentHighestMove.card)
    //       ? move
    //       : currentHighestMove
    // )
    // return moveWithHighestValue.playerId
  }

  calculateRoundScore(round) {
    // return 1
  }

  sendGameStateToPlayers() {
    this.allPlayers.forEach(player => {
      player.socket.emit(GameEvents.GameState, {
        gameId: this.id,
        winnerId: this.winnerId,
        previousSets: this.previousSets.map(set => set.toJSON()),
        currentSet: this.currentSet.toJSON(),
        teamA: this.teamA.toJSON(),
        teamB: this.teamB.toJSON(),
        me: player.toPrivateJSON()
        // players: {
        //   others: otherPlayers.map(otherPlayer => otherPlayer.toPublicJSON()),
        //   me: player.toPrivateJSON()
        // }
      })
    })
  }
}
