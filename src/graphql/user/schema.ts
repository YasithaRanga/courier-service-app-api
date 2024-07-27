import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    address: String
    createdAt: String!
    role: Role!
  }

  type Role {
    id: ID!
    name: String!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    role: String!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    address: String
    role: String
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createUser(userInput: UserInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
