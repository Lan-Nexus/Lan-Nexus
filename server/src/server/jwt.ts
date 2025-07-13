import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return next();
    (req as any).user = user;
    next();
  });
}

export function signJwt(payload: object, expiresIn: number): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}
