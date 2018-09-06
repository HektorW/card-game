import React from 'react'
import Suites from 'shared/constants/Suites'
import classNames from '../../utils/classNames'

const UnicodeSuits = {
  [Suites.Clubs]: '&#9827;',
  [Suites.Diamonds]: '&#9830;',
  [Suites.Hearts]: '&#9829;',
  [Suites.Spades]: '&#9824;'
}

const SuitSign = ({ suit, className = null }) => (
  <span
    className={classNames('suit-sign', className)}
    dangerouslySetInnerHTML={{ __html: UnicodeSuits[suit] }}
  />
)

export default SuitSign
