import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Suites from 'shared/constants/Suites'
import Values from 'shared/constants/Values'
import './card.scss'

const UnicodeSuits = {
  [Suites.Clubs]: '&#9827;',
  [Suites.Diamonds]: '&#9830;',
  [Suites.Hearts]: '&#9829;',
  [Suites.Spades]: '&#9824;'
}

export default class Card extends Component {
  static propTypes = {
    value: PropTypes.oneOf(Object.values(Values)).isRequired,
    suit: PropTypes.oneOf(Object.values(Suites)).isRequired,

    scale: PropTypes.number,
    rotation: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,

    onClick: PropTypes.func
  }

  getTransform() {
    const { scale, rotation, x, y } = this.props
    return `translate(${x || 0}px, ${y || 0}px) scale(${scale ||
      1}) rotate(${rotation || 0}deg)`
  }

  render() {
    const { value, suit, onClick } = this.props
    const isInteractive = Boolean(onClick)

    return (
      <div
        className={`card card--suit-${suit.toLowerCase()} ${
          isInteractive ? 'card--is-interactive' : ''
        }`}
        style={{ transform: this.getTransform() }}
        onClick={onClick}
      >
        <div className="card__upper">
          {value} of {suit}{' '}
          <span dangerouslySetInnerHTML={{ __html: UnicodeSuits[suit] }} />
        </div>
        <div className="card__lower">
          {value} of {suit}{' '}
          <span dangerouslySetInnerHTML={{ __html: UnicodeSuits[suit] }} />
        </div>
      </div>
    )
  }
}
