import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './routes/Home'
import Lobby from './routes/Lobby'

const CardGameApp = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/lobby" component={Lobby} />
    </Switch>
  </BrowserRouter>
)

export default CardGameApp
