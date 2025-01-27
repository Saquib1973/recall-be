import type { Request,Response,NextFunction } from 'express';
import jwt, { type JwtPayload } from "jsonwebtoken"
import env from '../utils/config';
export const userAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers['authorization'];
  const decoded = jwt.verify(header as string, env.JWT_SECRET);

  if (decoded) {
    req.userId = (decoded as JwtPayload).id;
    next();
  } else {
    res.status(403).send("You are not logged in")
  }
}