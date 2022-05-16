import { NotFoundError } from '@talawa-api/errors';
import { User } from '@talawa-api/models';
import { userExists } from '@talawa-api/utils';
import requestContext from '@talawa-api/request-context';
import superAdminCheck from '../functions/superAdminCheck';
import { MutationResolvers } from '../generatedTypes';

export const blockForPlugin: MutationResolvers['blockPluginCreationBySuperadmin'] =
  async (parent, args, context) => {
    let userFound = await userExists(args.userId);
    if (!userFound) {
      throw new NotFoundError(
        requestContext.translate('user.notFound'),
        'user.notFound',
        'user'
      );
    }

    const user = await User.findOne({
      _id: context.userId,
    });

    if (!user) {
      throw new NotFoundError(
        requestContext.translate('user.notFound'),
        'user.notFound',
        'user'
      );
    }

    superAdminCheck(context, user);
    userFound.overwrite({
      ...userFound._doc,
      pluginCreationAllowed: !args.blockUser,
    });

    return userFound;
  };

export default blockForPlugin;
