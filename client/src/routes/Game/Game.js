import React, { Component } from 'react'
import socketIO from 'socket.io-client'
import MyHandCards from '../../components/MyHandCards'
import RoundStats from '../../components/RoundStats'
import GameEvents from 'shared/constants/GameEvents'
import { getPlayerTeam } from 'shared/utils/player'

export default class Game extends Component {
  state = {
    gameState: null
  }

  componentDidMount() {
    this.socket = socketIO('http://localhost:4004')

    this.socket.on('connect', () => {
      console.log('connected')
    })

    this.socket.on(GameEvents.Server.GameState, gameState =>
      this.setState(() => ({ gameState }))
    )
  }

  onCardClick(card) {
    this.socket.emit(GameEvents.Client.RoundMove, {
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

    const { assetSuit, currentRound } = currentSet
    if (!currentRound) {
      return <div>No round</div>
    }

    const isMyTurn = currentRound.nextPlayerId === me.id
    const allPlayers = [...teamA.players, ...teamB.players]
    const team = getPlayerTeam([teamA, teamB], me.id)

    return (
      <main className="game">
        <div>
          Me: {me.id}, Points: {currentSet.teamAPoints}
        </div>

        {isMyTurn && <h1>It's my turn</h1>}

        <RoundStats
          assetSuit={assetSuit}
          round={currentRound}
          me={me}
          allPlayers={allPlayers}
        />

        <MyHandCards
          assetSuit={assetSuit}
          currentRound={currentRound}
          teamId={team.id}
          cards={me.cards}
          onCardClick={isMyTurn ? this.onCardClick.bind(this) : null}
        />
      </main>
    )
  }
}
