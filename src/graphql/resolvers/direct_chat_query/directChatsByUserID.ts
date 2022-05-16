///Resolver to find direct chats by User ID.
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { DirectChat } from '@talawa-api/models';
import { QueryResolvers } from '../generatedTypes';

export const directChatsByUserId: QueryResolvers['directChatsByUserID'] =
  async (parent, args) => {
    const directChatsFound = await DirectChat.find({ users: args.id });

    if (directChatsFound.length === 0) {
      throw new NotFoundError(
        process.env.NODE_ENV !== 'production'
          ? 'DirectChats not found'
          : requestContext.translate('directChats.notFound'),
        'directChats.notFound',
        'directChats'
      );
    }

    return directChatsFound;
  };

export default directChatsByUserId;
