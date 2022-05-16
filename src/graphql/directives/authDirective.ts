import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { UnauthenticatedError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';

export class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: any) {
    const resolver = field.resolve || defaultFieldResolver;
    field.resolve = async (root: any, args: any, context: any, info: any) => {
      if (context.expired || !context.isAuth)
        throw new UnauthenticatedError(
          requestContext.translate('user.notAuthenticated'),
          'user.notAuthenticated',
          'userAuthentication'
        );

      return resolver(root, args, context, info);
    };
  }
}

export default AuthenticationDirective;
