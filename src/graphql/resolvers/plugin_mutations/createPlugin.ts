import { User, Plugin, PluginField, Organization } from '@talawa-api/models';
import { UnauthorizedError, NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const createPlugin: MutationResolvers['createPlugin'] = async (
  parent,
  args,
  context
) => {
  let org = await Organization.findOne({
    _id: args.plugin.orgId,
  });

  if (!org) {
    throw new NotFoundError(
      requestContext.translate('organization.notFound'),
      'organization.notFound',
      'organization'
    );
  }

  const user = await User.findOne({
    _id: context.userId,
    pluginCreationAllowed: true,
  });

  if (!user) {
    throw new NotFoundError(
      requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  const isSuperAdmin = user.userType === 'SUPERADMIN';
  if (!isSuperAdmin) {
    const isAdmin = org.admins.includes(user.id);
    if (!isAdmin) {
      throw new UnauthorizedError(
        requestContext.translate('user.notAuthorized'),
        'user.notAuthorized',
        'userAuthorization'
      );
    }
  }

  let pluginAddnFields = [];
  if (args.plugin.fields.length > 0) {
    for (let i = 0; i < args.plugin.fields.length; i++) {
      let pluginField = new PluginField({
        key: args.plugin.fields[i].key,
        value: args.plugin.fields[i].value,
      });

      pluginAddnFields.push(pluginField);
    }
  }

  let plugin = new Plugin({
    orgId: args.plugin.orgId,
    pluginName: args.plugin.pluginName,
    pluginKey: args.plugin.pluginKey,
    additionalInfo: pluginAddnFields,
  });

  plugin = await plugin.save();

  return {
    ...plugin._doc,
  };
};

export default createPlugin;
