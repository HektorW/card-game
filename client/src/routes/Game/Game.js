import React, { Component } from 'react'
import socketIO from 'socket.io-client'
import GameEvents from 'shared/constants/GameEvents'
import Card from '../../components/Card'

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

    const isMyTurn = currentRound.nextPlayerId === me.id

    return (
      <main className="game">
        <div>Me: {me.id}</div>
        {isMyTurn && <div>It's my turn</div>}
        <div>
          {me.cards.map(card => (
            <Card
              key={`${card.suit}-${card.value}`}
              suit={card.suit}
              value={card.value}
              onClick={isMyTurn ? () => this.onCardClick(card) : null}
            />
          ))}
        </div>
      </main>
    )
  }
}
