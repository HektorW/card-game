import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => (
  <main className="home">
    <h1>Card game</h1>
    <Link to="/game">Start game</Link>
  </main>
)

export default Home
