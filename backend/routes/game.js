const express = require('express')
const router = express.Router()

router.post('/create', (req, res) => {
  const { players } = req.body
  const gameId = crypto.randomUUID()

  res.json({ gameId })
})

module.exports = router