/* global module */
import 'react-hot-loader/patch'

import React from 'react'
import { render } from 'react-dom'
import { AppContainer as HotLoaderContainer } from 'react-hot-loader'
import socketIO from 'socket.io-client'
import CardGameApp from './CardGameApp'
// import { Provider } from 'react-redux'
// import createStore from './store/createStore'

const rootElement = document.getElementById('app')
// const store = createStore()

const renderApp = CardGameAppComponent => {
  render(
    <HotLoaderContainer>
      <CardGameAppComponent />
    </HotLoaderContainer>,
    rootElement
  )
}

renderApp(CardGameApp)

if (module.hot) {
  module.hot.accept('./CardGameApp', () => renderApp(CardGameApp))
}

const socket = socketIO('http://localhost:4004')

socket.on('connect', () => {
  console.log('connected')
})
