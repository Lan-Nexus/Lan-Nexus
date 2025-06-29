import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import expressLayouts from 'express-ejs-layouts';

import apiRouter from './Routers/api.js'
import webRouter from './Routers/web.js'
import './db.js'
import { Worker } from 'worker_threads';
import path from 'path';
import Ip from './ip.js';


const app = express()
const port = process.env.PORT || 3000

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set in environment variables');
  process.exit(1);
}

if (!process.env.STEAM_GRID_ID_KEY) {
  console.error('STEAM_GRID_ID_KEY is not set in environment variables');
  console.info('\x1b[34mYou can get a key from https://www.steamgriddb.com/profile/preferences/api\x1b[0m');
  process.exit(1);
}

if (!process.env.STEAM_API_KEY) {
  console.error('STEAM_API_KEY is not set in environment variables');
  process.exit(1);
}



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout'); // uses views/layout.ejs by default

app.use(express.static('public'))


app.use('/api', apiRouter)
app.use('/', webRouter)

app.get('/api/ip', (req, res) => {
  const ip = Ip(req, res);
  res.json({ ip });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const __filename = path.resolve(process.argv[1]);
const __dirname = path.dirname(__filename);
new Worker(path.join(__dirname, './workers/sendAddress.js'));
