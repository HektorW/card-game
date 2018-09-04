import React, { Component } from 'react'
import socketIO from 'socket.io-client'
import MyHandCards from '../../components/MyHandCards'
import RoundStats from '../../components/RoundStats'
import GameEvents from 'shared/constants/GameEvents'

export default class Game extends Component {
  state = {
    gameState: null
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
    if (!gameState) {
      return null
    }

    const { teamA, teamB, currentSet, me } = gameState
    if (!me.id) {
      return <div>Game not loaded yet</div>
    }

    if (!currentSet) {
      return <div>No set</div>
    }

    const { currentRound } = currentSet
    if (!currentRound) {
      return <div>No round</div>
    }

    const isMyTurn = currentRound.nextPlayerId === me.id
    const allPlayers = [...teamA.players, ...teamB.players]
    return (
      <main className="game">
        <div>
          Me: {me.id}, Points: {me.points}
        </div>

        {isMyTurn && <h1>It's my turn</h1>}

        <RoundStats round={currentRound} me={me} allPlayers={allPlayers} />

        <MyHandCards
          cards={me.cards}
          onCardClick={isMyTurn ? this.onCardClick.bind(this) : null}
        />
      </main>
    )
  }
}
