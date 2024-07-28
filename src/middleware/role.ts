import { Request, Response, NextFunction, request } from 'express';
import { adminResolvers } from '../graphql';
interface RoleRequest extends Request {
  user?: any;
  resolverNames?: string[];
}

export const roleMiddleware = (requiredRole: string) => {
  return (req: RoleRequest, res: Response, next: NextFunction) => {
    if (requiredRole === 'ADMIN') {
      if (adminResolvers.length > 0) {
        const hasAdminResolvers = req.resolverNames?.some((name: string) =>
          adminResolvers.includes(name)
        );
        if (hasAdminResolvers) {
          const userRole = req.user?.role;

          if (userRole !== requiredRole) {
            return res
              .status(403)
              .json({ message: 'Access denied', success: false });
          }

          return next();
        }
        return next();
      }
      return next();
    }
    return next();
  };
};
