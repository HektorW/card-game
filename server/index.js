const { createServer } = require('http')
const Koa = require('koa')
const cors = require('@koa/cors')
const websocketServer = require('./websocket-server')
const log = require('../log')(__filename)

const app = new Koa()
const server = createServer(app.callback())

websocketServer.init(server)

app.use(async (ctx, next) => {
  log.debug('request', { ctx })
  await next()
  log.debug('response', { status: ctx.status, body: ctx.body })
})

app.use(ctx => {
  if (ctx.path === '/gamestate') {
    const { gameId } = ctx.query
    const game = websocketServer.games[gameId]
    ctx.body = game
      ? websocketServer.games[gameId].getDebugGameState()
      : `Cant find game "${gameId}"`
  }
})

module.exports = server
