import { userSchema } from './user/schema';
import { userResolvers } from './user/resolvers';
import { shipmentResolvers } from './shipment/resolvers';
import { shipmentSchema } from './shipment/schema';
import { makeExecutableSchema, mergeSchemas } from 'apollo-server-express';

export const authExcludedResolvers: string[] = [
  'createUser',
  'login',
  'getShipment',
];
export const adminResolvers: string[] = [];

export const schema = mergeSchemas({
  schemas: [
    makeExecutableSchema({ typeDefs: userSchema, resolvers: userResolvers }),
    makeExecutableSchema({
      typeDefs: shipmentSchema,
      resolvers: shipmentResolvers,
    }),
  ],
});
