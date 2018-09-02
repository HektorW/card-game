import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Suites from 'shared/constants/Suites'
import Values from 'shared/constants/Values'
import './card.scss'

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
    const { value, suit } = this.props

    return (
      <div
        className={`card card--suit-${suit.toLowerCase()}`}
        style={{ transform: this.getTransform() }}
        onClick={this.props.onClick}
      >
        {value} of {suit}
      </div>
    )
  }
}
