import React, { Component } from 'react'
import socketIO from 'socket.io-client'
import MyHandCards from '../../components/MyHandCards'
import RoundStats from '../../components/RoundStats'
import GameEvents from 'shared/constants/GameEvents'

export default class Game extends Component {
  state = {
    gameState: {
      previousRounds: [],
      currentRound: {},
      players: {
        others: [],
        me: {}
      }
    }
  }

  componentDidMount() {
    this.socket = socketIO('http://localhost:4004')

    this.socket.on('connect', () => {
      console.log('connected')
    })

    this.socket.on(GameEvents.GameState, gameState =>
      this.setState(() => ({ gameState }))
    )
  }

  onCardClick(card) {
    this.socket.emit(GameEvents.Move, {
      card
    })
  }

  render() {
    const { gameState } = this.state
    const {
      currentRound,
      players: { me, others }
    } = gameState

    if (!me.id) {
      return <div>Game not loaded yet</div>
    }

    if (gameState.winnerId) {
      const winner =
        gameState.winnerId === me.id
          ? me
          : others.find(other => other.id === gameState.winnerId)
      return (
        <div>
          Winner is {winner === me ? 'you' : winner.id} with {winner.points}{' '}
          points
        </div>
      )
    }

    const isMyTurn = currentRound.nextPlayerId === me.id
    const allPlayers = [me, ...others]

    return (
      <main className="game">
        <div>
          Me: {me.id}, Points: {me.points}
        </div>
        {isMyTurn && <div>It's my turn</div>}

        <RoundStats round={currentRound} me={me} others={others} />

        <MyHandCards
          cards={me.cards}
          onCardClick={isMyTurn ? this.onCardClick.bind(this) : null}
        />
      </main>
    )
  }
}
