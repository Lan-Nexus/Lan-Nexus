import 'dotenv/config'
import express from 'express';
import ViteExpress from "vite-express";
import cors from 'cors'

import apiRouter from './Routers/api.js'
import webRouter from './Routers/web.js'
import './db.js'
import { Worker } from 'worker_threads';
import path from 'path';
import Ip from './ip.js';
import './workers/sendAddress.js';


const app = express()
const port = Number(process.env.PORT || 3000)

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

if (process.env.NODE_ENV === 'production') {
  ViteExpress.config({
    inlineViteConfig: {
      build: { outDir: "public" }
    }
  });
}


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api', apiRouter)

app.get('/api/ip', (req, res) => {
  const ip = Ip(req, res);
  res.json({ ip });
});


ViteExpress.listen(app, port, () =>
  console.log(`Server is listening on port ${port}...`),
);

// const __filename = path.resolve(process.argv[1]);
// const __dirname = path.dirname(__filename);
// new Worker(path.join(__dirname, './workers/sendAddress.js'));
