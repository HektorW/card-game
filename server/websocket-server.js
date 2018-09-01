const socketIO = require('socket.io')
const log = require('../log')(__filename)

module.exports.init = server => {
  const io = socketIO(server)

  io.on('connection', socket => {
    log.debug('connection')
  })
}
