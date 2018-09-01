import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Suites from '../../constants/Suites'
import Values from '../../constants/Values'
import './card.scss'

export default class Card extends Component {
  static propTypes = {
    value: PropTypes.oneOf(Object.values(Values)).isRequired,
    suit: PropTypes.oneOf(Object.values(Suites)).isRequired,

    scale: PropTypes.number,
    rotation: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  }

  getTransform() {
    const { scale, rotation, x, y } = this.props
    return `translate(${x || 0}px, ${y || 0}px) scale(${scale ||
      1}) rotate(${rotation || 0}deg)`
  }

  render() {
    const { value, suit } = this.props

    return (
      <div className="card" style={{ transform: this.getTransform() }}>
        {value} of {suit}
      </div>
    )
  }
}
