import superAdminCheck from '../functions/superAdminCheck';
import { User, Organization, Plugin } from '@talawa-api/models';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { QueryResolvers } from '../generatedTypes';

export const superAdminPlugin: QueryResolvers['plugin'] = async (
  parent,
  args,
  context
) => {
  const organizationFound = await Organization.findOne({
    _id: args.orgId,
  });

  if (!organizationFound) {
    throw new NotFoundError(
      requestContext.translate('organization.notFound'),
      'organization.notFound',
      'organization'
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

  const pluginFound = await Plugin.find({
    orgId: args.orgId,
    pluginStatus: 'ACTIVE',
  });

  return pluginFound;
};

export default superAdminPlugin;
