import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import Lobby from './components/Lobby'
import RoleReveal from './components/RoleReveal'

function Game() {
  const { id } = useParams()
  const [players, setPlayers] = useState([])
  const [phase, setPhase] = useState('lobby')
  const [myRole, setMyRole] = useState(null)
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = io('http://localhost:3002')
    socketRef.current = socket

    socket.emit('join_game', { gameId: id, name: 'Player 1' })

    socket.on('room_update', ({ players }) => {
      setPlayers(players)
    })

    socket.on('phase_change', ({ phase }) => {
      setPhase(phase)
    })

    socket.on('your_role', (roleData) => {
      setMyRole(roleData)
    })

    return () => socket.disconnect()
  }, [])

  return (
    <div>
      {phase === 'lobby' && <Lobby socket={socketRef.current} gameId={id} players={players} />}
      {phase === 'role_reveal' && <RoleReveal socket={socketRef.current} gameId={id} myRole={myRole} />}
    </div>
  )
}

export default Game