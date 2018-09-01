const server = require('./server')
const log = require('./log')('card-game')

const port = process.env.PORT || 4004

server.listen(port, () => {
  log.info('started card-game', { port })
})
