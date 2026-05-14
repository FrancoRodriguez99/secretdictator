const Game = require('../Game')

// ─── In-memory state ─────────────────────────────────────────────────────────

const games = new Map()
// games: gameId → Game instance

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPlayersInRoom(io, gameId) {
  const room = io.sockets.adapter.rooms.get(gameId)
  if (!room) return []
  return [...room].map(socketId => {
    const s = io.sockets.sockets.get(socketId)
    return { id: socketId, name: s?.data?.name }
  })
}

// ─── Handlers ────────────────────────────────────────────────────────────────

function onJoinGame(io, socket, { gameId, name }) {
  socket.join(gameId)
  socket.data.name = name
  socket.data.gameId = gameId

  const players = getPlayersInRoom(io, gameId)
  io.to(gameId).emit('room_update', { players })
}

function onUpdateName(io, socket, { gameId, name }) {
  socket.data.name = name

  const players = getPlayersInRoom(io, gameId)
  io.to(gameId).emit('room_update', { players })
}

function onStartGame(io, socket, { gameId }) {
  const players = getPlayersInRoom(io, gameId)

  if (players.length < 5) {
    socket.emit('start_error', { message: 'Need at least 5 players to start.' })
    return
  }

  // Assign a shuffled role to each player's socket data
  const roles = Game.buildRoles(players.length)
  const fascistIds = []

  players.forEach((p, i) => {
    const s = io.sockets.sockets.get(p.id)
    if (!s) return
    s.data.role  = roles[i]
    s.data.party = roles[i] === 'LIBERAL' ? 'LIBERAL' : 'FASCIST'
    if (roles[i] === 'FASCIST') fascistIds.push(p.id)
  })

  const fascistNames = fascistIds.map(id => io.sockets.sockets.get(id)?.data?.name)

  games.set(gameId, new Game(players))

  // Send each player their role privately
  players.forEach(p => {
    const s = io.sockets.sockets.get(p.id)
    if (!s) return

    const roleData = { role: s.data.role, party: s.data.party }
    if (s.data.role === 'FASCIST') {
      roleData.fascistNames = fascistNames.filter(n => n !== s.data.name)
    }

    s.emit('your_role', roleData)
  })

  io.to(gameId).emit('phase_change', { phase: 'role_reveal' })
}

function onRoleConfirmed(io, socket, { gameId }) {
  const game = games.get(gameId)
  if (!game) return

  const allConfirmed = game.confirmRole()

  if (allConfirmed) {
    game.phase = 'nomination'
    io.to(gameId).emit('phase_change', {
      phase: 'nomination',
      presidentId: game.presidentId,
      eligibleCandidates: game.getEligibleCandidates(),
    })
  }
}

function onDisconnect(io, socket) {
  const { gameId, name } = socket.data
  console.log(`${name} disconnected from game ${gameId}`)

  const players = getPlayersInRoom(io, gameId)
  io.to(gameId).emit('room_update', { players })
}

// ─── Registration ─────────────────────────────────────────────────────────────

function registerGameHandlers(io, socket) {
  socket.on('join_game',      (data) => onJoinGame(io, socket, data))
  socket.on('update_name',    (data) => onUpdateName(io, socket, data))
  socket.on('start_game',     (data) => onStartGame(io, socket, data))
  socket.on('role_confirmed', (data) => onRoleConfirmed(io, socket, data))
  socket.on('disconnect',     ()     => onDisconnect(io, socket))
}

module.exports = { registerGameHandlers }