import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import expressLayouts from 'express-ejs-layouts';

import apiRouter from './Routers/api.js'
import webRouter from './Routers/web.js'
import './db.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout'); // uses views/layout.ejs by default

app.use(express.static('public'))

app.use('/api', apiRouter)
app.use('/', webRouter)

app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)
})
