import { gql } from 'apollo-server-express';

export const userSchema = gql(`
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


  type Mutation {
    createUser(userInput: UserInput!): User
  }

  type Query {
    login(email: String!, password: String!): AuthData!
    getUser(email: String!): User!
    getAuth(userId: Int!): User!
  }
`);
