const { createServer } = require('http')
const { Server } = require('socket.io')
const { registerGameHandlers } = require('./handlers/game')

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: { origin: '*' }
})

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id)
  registerGameHandlers(io, socket)
})

httpServer.listen(3002, () => console.log('Socket server running on :3002'))