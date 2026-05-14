const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/game', require('./routes/game'))

app.listen(3001, () => console.log('Backend running on :3001'))