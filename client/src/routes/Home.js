import React from 'react'
import Card from '../components/Card/Card'
import Values from '../constants/Values'
import Suites from '../constants/Suites'

const Home = () => (
  <div>
    <Card
      value={Values.Ace}
      suit={Suites.Clubs}
      scale={1}
      rotation={10}
      x={200}
      y={100}
    />
  </div>
)

export default Home
