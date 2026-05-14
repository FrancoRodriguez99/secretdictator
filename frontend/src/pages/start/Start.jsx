import { useNavigate } from 'react-router-dom'

function Start() {
  const navigate = useNavigate()

  async function handleStart() {
    const response = await fetch('http://localhost:3001/game/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ players })
   })
    const data = await response.json()
    navigate(`/game/${data.gameId}`)
  }

  return (
    <div>
      Hello, starting a new game?
      <button onClick={handleStart}>Start</button>
    </div>
  )
}

export default Start