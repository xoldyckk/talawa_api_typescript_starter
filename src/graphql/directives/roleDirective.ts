import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { UnauthenticatedError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { userExists } from '@talawa-api/utils';

export class RoleAuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: any) {
    const resolver = field.resolve || defaultFieldResolver;
    const { requires } = this.args;
    field.resolve = async (root: any, args: any, context: any, info: any) => {
      const user = await userExists(context.userId);

      if (user.userType !== requires) {
        throw new UnauthenticatedError(
          requestContext.translate('user.notAuthenticated'),
          'user.notAuthenticated',
          'userAuthentication'
        );
      }

      context.user = user;

      return resolver(root, args, context, info);
    };
  }
}

export default RoleAuthorizationDirective;
