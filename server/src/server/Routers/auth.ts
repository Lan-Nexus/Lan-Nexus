import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { signJwt } from '../jwt.js';
import dayjs from 'dayjs';

const router = Router();

// const username = process.env.ADMIN_USERNAME || 'admin';
const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'password', 10);

router.post('/login', (req: any, res: any) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (username !== username || !bcrypt.compareSync(password, passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const authTime = Number(process.env.AUTH_TIME) || 1;
  const expires = dayjs().add(authTime, 'hour');
  const expiresIn = expires.diff(dayjs(), 'seconds');
  const token = signJwt({ username, role: 'admin' }, expiresIn);

  res.json({ token, expires: expires.toISOString(), role: 'admin' });
});

export default router;
