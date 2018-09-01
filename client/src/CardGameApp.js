import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './routes/Home'

const CardGameApp = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>
  </BrowserRouter>
)

export default CardGameApp
