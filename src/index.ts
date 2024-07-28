import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './graphql';
import { Context, createContext } from './context';
import { authMiddleware } from './middleware/auth';
import { roleMiddleware } from './middleware/role';
import { extractResolverNames } from './middleware/resolver';

const app: any = express();

app.use(express.json());

app.use(extractResolverNames);

app.use(authMiddleware);

app.use(roleMiddleware('ADMIN'));

const server = new ApolloServer({
  schema,
  context: ({ req }: Context) => createContext(req),
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
