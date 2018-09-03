const socketIO = require('socket.io')
const Game = require('./game-logic/Game')
const Player = require('./game-logic/PlayerModel')
const Team = require('./game-logic/Team')
const MockPlayerSocket = require('./game-logic/MockPlayerSocket')
const log = require('../log')(__filename)

module.exports.init = server => {
  const io = socketIO(server)

  io.on('connection', socket => {
    log.debug('connection', { socket: { id: socket.id } })

    const teamA = new Team('a', [
      new Player(socket, 0),
      new Player(new MockPlayerSocket(), 1)
    ])

    const teamB = new Team('b', [
      new Player(new MockPlayerSocket(), 2),
      new Player(new MockPlayerSocket(), 3)
    ])

    const game = new Game(teamA, teamB)
  })
}
