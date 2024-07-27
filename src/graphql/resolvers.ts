import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

interface UserInput {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: string;
}

interface AuthData {
  userId: number;
  token: string;
  tokenExpiration: number;
  role: string;
}

export const unprotectedResolvers = {
  createUser: async ({ userInput }: { userInput: UserInput }) => {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userInput.email },
      });

      if (existingUser) {
        throw new Error('User exists already.');
      }

      const hashedPassword = await bcrypt.hash(userInput.password, 12);

      const role = await prisma.role.findUnique({
        where: { name: userInput.role ? userInput.role : 'USER' },
      });

      if (!role) {
        throw new Error('Role not found.');
      }

      const user = await prisma.user.create({
        data: {
          name: userInput.name,
          email: userInput.email,
          password: hashedPassword,
          phoneNumber: userInput.phoneNumber,
          role: {
            connect: { id: role.id },
          },
        },
        include: { role: true },
      });

      return { ...user, password: null };
    } catch (err) {
      throw err;
    }
  },

  login: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthData> => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });

      if (!user) {
        throw new Error('User does not exist!');
      }

      const isEqual = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        throw new Error('Password is incorrect!');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role.name },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      return {
        userId: user.id,
        token,
        tokenExpiration: 1,
        role: user.role.name,
      };
    } catch (err) {
      throw err;
    }
  },
};

export const protectedResolvers = {};
