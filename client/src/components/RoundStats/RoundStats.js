import React from 'react'
import Card from '../Card'
import classNames from '../../utils/classNames'
import './round-stats.scss'

const RoundStats = ({ round, me, allPlayers }) => (
  <div className="round-stats">
    {round.moves.map(move => {
      const movePlayer = allPlayers.find(player => move.playerId === player.id)

      return (
        <div
          key={movePlayer.id}
          className={classNames(
            'round-stats__move',
            `round-stats__move--index-${(4 + movePlayer.index - me.index) % 4}`
          )}
        >
          <Card {...move.card} scale={0.8} />
        </div>
      )
    })}
  </div>
)

export default RoundStats
