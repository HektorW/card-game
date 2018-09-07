import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Suites from 'shared/constants/Suites'
import SuitSign from '../SuitSign'

const PointsToChooseBetween = [80, 90, 100, 110, 120, 130, 140, 150, 160]

export default class SetPrediction extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onPass: PropTypes.func.isRequired
  }

  state = {
    selectedPoints: null,
    selectedSuit: null
  }

  render() {
    const { onSelect, onPass } = this.props
    const { selectedPoints, selectedSuit } = this.state

    const hasChoosen = selectedPoints !== null && selectedSuit !== null

    return (
      <div className="set-prediction">
        <ul className="set-prediction__points-list">
          {PointsToChooseBetween.map(points => (
            <li className="set-prediction__points-item">
              <button
                className="set-prediction__points-item-button"
                onClick={() =>
                  this.setState(() => ({ selectedPoints: points }))
                }
              >
                {points}
              </button>
            </li>
          ))}
        </ul>

        <ul className="set-prediction__suits-list">
          {Object.values(Suites).map(suit => (
            <li className="set-prediction__suits-item">
              <button
                className="set-prediction__suits-item-button"
                onClick={() => this.setState(() => ({ selectedSuit: suit }))}
              >
                <SuitSign suit={suit} /> {suit}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="set-prediction__select-button"
          disabled={!hasChoosen}
          onClick={() => onSelect(selectedPoints, selectedSuit)}
        >
          Select
        </button>
        <button className="set-prediction__pass-button" onClick={onPass}>
          Pass
        </button>
      </div>
    )
  }
}
