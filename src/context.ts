import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  req: Request;
  user?: any;
}

export const createContext = (req: Request): Context => {
  return {
    prisma,
    req,
    user: (req as any).user,
  };
};
