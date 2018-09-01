import socketIO from 'socket.io-client'

const socket = socketIO('http://localhost:4004')

socket.on('connect', () => {
  console.log('connected')
})
