import { User, Organization, DirectChat } from '@talawa-api/models';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const createDirectChat: MutationResolvers['createDirectChat'] = async (
  parent,
  args,
  context
) => {
  let user = await User.findOne({ _id: context.userId });
  if (!user) {
    throw new NotFoundError(
      process.env.NODE_ENV !== 'production'
        ? 'User not found'
        : requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  const org = await Organization.findOne({ _id: args.data.organizationId });
  if (!org) {
    throw new NotFoundError(
      process.env.NODE_ENV !== 'production'
        ? 'Organization not Found'
        : requestContext.translate('organization.notFound'),
      'organization.notFound',
      'organization'
    );
  }

  const usersInChat = [];

  // add users to cat
  for await (const userId of args.data.userIds) {
    const user = await await User.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundError(
        process.env.NODE_ENV !== 'production'
          ? 'User not found'
          : requestContext.translate('user.notFound'),
        'user.notFound',
        'user'
      );
    }
    usersInChat.push(user);
  }

  let directChat = new DirectChat({
    creator: user,
    users: usersInChat,
    organization: org,
  });

  directChat = await directChat.save();

  return directChat.toObject();
};

export default createDirectChat;
