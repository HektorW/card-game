const socketIO = require('socket.io')
const Game = require('./game-logic/Game')
const MockPlayerSocket = require('./game-logic/MockPlayerSocket')
const log = require('../log')(__filename)

module.exports.init = server => {
  const io = socketIO(server)

  io.on('connection', socket => {
    log.debug('connection', { socket: { id: socket.id } })

    const mockPlayerSockets = [
      new MockPlayerSocket(),
      new MockPlayerSocket(),
      new MockPlayerSocket()
    ]

    const game = new Game([socket, ...mockPlayerSockets])
  })
}
