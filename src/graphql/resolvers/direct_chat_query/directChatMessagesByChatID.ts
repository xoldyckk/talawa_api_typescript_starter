///Resolver to find direct chats messages by User ID.
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { DirectChatMessage } from '@talawa-api/models';
import {
  IN_PRODUCTION,
  CHAT_NOT_FOUND,
  CHAT_NOT_FOUND_MESSAGE,
  CHAT_NOT_FOUND_CODE,
  CHAT_NOT_FOUND_PARAM,
} from '@talawa-api/constants';
import { QueryResolvers } from '../generatedTypes';

export const directChatMessagesByChatId: QueryResolvers['directChatsMessagesByChatID'] =
  async (parent, args) => {
    const directChatsMessagesFound = await DirectChatMessage.find({
      directChatMessageBelongsTo: args.id,
    });
    if (directChatsMessagesFound.length === 0) {
      throw new NotFoundError(
        !IN_PRODUCTION
          ? CHAT_NOT_FOUND
          : requestContext.translate(CHAT_NOT_FOUND_MESSAGE),
        CHAT_NOT_FOUND_CODE,
        CHAT_NOT_FOUND_PARAM
      );
    }
    return directChatsMessagesFound;
  };

export default directChatMessagesByChatId;
