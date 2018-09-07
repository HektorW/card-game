import React from 'react'
import Card from '../Card'
import { isValidMove } from 'shared/utils/round'
import './my-hand-cards.scss'

const MyHandCards = ({
  assetSuit,
  currentRound,
  teamId,
  cards,
  onCardClick
}) => (
  <div className="my-hand-cards">
    {cards.map((card, index) => (
      <Card
        key={`${card.suit}-${card.value}`}
        onClick={
          onCardClick &&
          isValidMove(assetSuit, currentRound.moves, teamId, cards, card)
            ? () => onCardClick(card)
            : null
        }
        {...card}
        isAssetSuit={card.suit === assetSuit}
        x={200 + index * 100}
        y={-200 - 15 * (cards.length / 2 - Math.abs(cards.length / 2 - index))}
        scale={0.9}
        rotation={-15 + 30 * (index / cards.length)}
      />
    ))}
  </div>
)

export default MyHandCards
