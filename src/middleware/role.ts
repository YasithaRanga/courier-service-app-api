import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (userRole !== requiredRole) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    next();
  };
};
