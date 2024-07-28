import { NextFunction, Request } from 'express';
import { parse, OperationDefinitionNode, Kind } from 'graphql';

interface ResolverRequest extends Request {
  resolverNames?: string[];
}
export const getResolverNames = (req: Request): string[] | undefined => {
  const query = req.body.query || req.query.query;
  if (query) {
    const document = parse(query);

    const mainOperation = document.definitions.find(
      (def): def is OperationDefinitionNode =>
        def.kind === Kind.OPERATION_DEFINITION
    );

    if (mainOperation && mainOperation.selectionSet) {
      return mainOperation.selectionSet.selections.map(
        (selection: any) => selection.name.value
      );
    }
  }
  return undefined;
};

export const extractResolverNames = (
  req: ResolverRequest,
  res: Response,
  next: NextFunction
) => {
  const resolverNames = getResolverNames(req);
  if (resolverNames) {
    req.resolverNames = resolverNames;
  }

  next();
};
