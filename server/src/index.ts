import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import apiRouter from './Routers/api.js'
import './db.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use('/api', apiRouter)

app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)
})
