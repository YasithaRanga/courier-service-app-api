import {
  protectedUserResolvers,
  unprotectedUserResolvers,
} from './user/resolvers';

export const unprotectedResolvers = { ...unprotectedUserResolvers };
export const protectedResolvers = { ...protectedUserResolvers };
export const adminResolvers = { ...protectedUserResolvers };
