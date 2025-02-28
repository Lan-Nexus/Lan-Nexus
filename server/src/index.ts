import express from 'express'
import dotenv from 'dotenv'
import apiRouter from './Routers/api'
import './db'
dotenv.config()

const app = express()
const port = process.env.PORT || 3000


app.use('/api', apiRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
