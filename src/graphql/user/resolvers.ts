import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const userResolvers = {
  Query: {
    login: async (_: any, args: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({
        where: { email: args.email },
      });
      if (!user) throw new Error('User does not exist');

      const isEqual = await bcrypt.compare(args.password, user.password);
      if (!isEqual) throw new Error('Password is incorrect');

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.roleId },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      return {
        userId: user.id,
        token,
        tokenExpiration: 1,
        role: user.roleId,
      };
    },
    getUser: async (_: any, args: { email: string }) => {
      const user = await prisma.user.findUnique({
        where: { email: args.email },
      });
      if (!user) throw new Error('User does not exist');

      return user;
    },
  },
  Mutation: {
    createUser: async (_: any, args: { userInput: any }, context: any) => {
      if (!context.user || context.user.role !== 'ADMIN')
        throw new Error('Not authorized');
      const { name, email, password, address, role } = args.userInput;
      const hashedPassword = await bcrypt.hash(password, 12);
      const userRole = await prisma.role.findUnique({ where: { name: role } });
      return await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          address,
          roleId: userRole?.id ?? 1,
        },
      });
    },
  },
};
