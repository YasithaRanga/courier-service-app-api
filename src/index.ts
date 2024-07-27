import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import dotenv from 'dotenv';
import { schema } from './graphql/schema';
import { protectedResolvers, unprotectedResolvers } from './graphql/resolvers';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './middleware/auth';
import { roleMiddleware } from './middleware/role';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Unprotected GraphQL endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: unprotectedResolvers,
    graphiql: true,
  })
);

// Protected GraphQL endpoint with role-based access control
app.use(
  '/graphql',
  authMiddleware,
  roleMiddleware('ADMIN'), // Example: only ADMIN can access
  graphqlHTTP({
    schema,
    rootValue: protectedResolvers,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
