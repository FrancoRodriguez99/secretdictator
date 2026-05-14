import { useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useNavigate } from 'react-router-dom'

function Game() {
    const navigate = useNavigate()
  const { id } = useParams()

  return (
    <div>
      <QRCodeSVG value={`http://localhost:5173/game/${id}`} />
      <button onClick={() => navigate(`/game/${id}`)}>Back to Game</button>
    </div>
  )
}

export default Game