import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { signJwt } from '../jwt.js';

const router = Router();

const username = process.env.ADMIN_USERNAME || 'admin';
const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'password', 10);

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (username !== username || !bcrypt.compareSync(password, passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = signJwt({ username });
  res.json({ token });
});

export default router;
