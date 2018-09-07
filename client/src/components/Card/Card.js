import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SuitSign from '../SuitSign'
import Suites from 'shared/constants/Suites'
import Values from 'shared/constants/Values'
import './card.scss'
import classNames from '../../utils/classNames'

export default class Card extends Component {
  static propTypes = {
    className: PropTypes.string,

    value: PropTypes.oneOf(Object.values(Values)).isRequired,
    suit: PropTypes.oneOf(Object.values(Suites)).isRequired,
    isAssetSuit: PropTypes.bool,

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
    const { className, value, suit, isAssetSuit, onClick } = this.props
    const isInteractive = Boolean(onClick)

    return (
      <div
        className={classNames(
          'card',
          `card--suit-${suit.toLowerCase()}`,
          isAssetSuit && 'card--is-asset-suit',
          isInteractive && 'card--is-interactive',
          className
        )}
        style={{ transform: this.getTransform() }}
        onClick={onClick}
      >
        <div className="card__upper">
          {value} of {suit} <SuitSign suit={suit} />
        </div>
        <div className="card__lower">
          {value} of {suit} <SuitSign suit={suit} />
        </div>
      </div>
    )
  }
}
