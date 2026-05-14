import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Start from './pages/start/Start'
import Game from './pages/game/Game'
import Qr from './pages/qr/Qr'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/qr/:id" element={<Qr />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
