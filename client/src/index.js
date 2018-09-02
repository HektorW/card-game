/* global module */
import 'react-hot-loader/patch'

import React from 'react'
import { render } from 'react-dom'
import { AppContainer as HotLoaderContainer } from 'react-hot-loader'
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
