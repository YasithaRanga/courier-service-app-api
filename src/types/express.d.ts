import { User } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: number;
      email: string;
      role: string;
    };
  }
}
