import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authExcludedResolvers } from '../graphql';

interface AuthRequest extends Request {
  user?: any;
  resolverNames?: string[];
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const hasExcludedResolvers = req.resolverNames?.some((name: string) =>
    authExcludedResolvers.includes(name)
  );
  if (hasExcludedResolvers) {
    return next();
  }

  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.user = null;
    return res
      .status(401)
      .json({ message: 'Authorization is required', success: false });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return res
      .status(401)
      .json({ message: 'Token is required', success: false });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    req.user = null;
    return res
      .status(502)
      .json({ message: 'Token is expired', success: false });
  }

  if (!decodedToken) {
    req.user = null;
    return res.status(404).json({ message: 'User not found', success: false });
  }

  req.user = decodedToken;
  next();
};
