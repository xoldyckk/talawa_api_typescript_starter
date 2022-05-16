import adminCheck from '../functions/adminCheck';
import { Organization, Plugin } from '@talawa-api/models';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { QueryResolvers } from '../generatedTypes';

export const adminPlugin: QueryResolvers['adminPlugin'] = async (
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

  adminCheck(context, organizationFound);
  const pluginFound = await Plugin.find({
    orgId: args.orgId,
    pluginStatus: 'ACTIVE',
    adminAccessAllowed: true,
  });

  return pluginFound;
};

export default adminPlugin;
