import React from 'react'
import Card from '../Card'
import './round-stats.scss'

const RoundStats = ({ round, me, others }) => (
  <div className="round-stats">
    {round.moves.map(move => {
      const movePlayer =
        move.playerId === me.id
          ? me
          : others.find(player => move.playerId === player.id)

      return (
        <div
          key={movePlayer.id}
          className={`round-stats__move round-stats__move--index-${(4 +
            movePlayer.index -
            me.index) %
            4}`}
        >
          <Card {...move.card} scale={0.8} />
        </div>
      )
    })}
  </div>
)

export default RoundStats
