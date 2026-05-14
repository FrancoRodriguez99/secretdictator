import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Lobby({ socket, gameId, players }) {
  const [name, setName] = useState('Player 1')
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      socket?.emit('update_name', { gameId, name })
    }, 500)

    return () => clearTimeout(timeout)
  }, [name])

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => navigate(`/qr/${gameId}`)}>Share QR</button>
      <ul>
        {players.map(player => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      <button
        onClick={() => socket?.emit('start_game', { gameId })}
        disabled={players.length < 5}
      >
        Start {players.length < 5 ? `(need ${5 - players.length} more)` : ''}
      </button>
    </div>
  )
}

export default Lobby
