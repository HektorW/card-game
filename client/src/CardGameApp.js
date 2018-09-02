import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './routes/Home'
import Lobby from './routes/Lobby'
import Game from './routes/Game'

const CardGameApp = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/lobby" component={Lobby} />
      <Route path="/game" component={Game} />
    </Switch>
  </BrowserRouter>
)

export default CardGameApp
