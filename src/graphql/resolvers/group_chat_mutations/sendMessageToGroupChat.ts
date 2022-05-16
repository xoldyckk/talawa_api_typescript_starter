import { GroupChat, GroupChatMessage } from '@talawa-api/models';
import { userExists } from '@talawa-api/utils';
import { NotFoundError, UnauthorizedError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import {
  IN_PRODUCTION,
  USER_NOT_AUTHORIZED,
  USER_NOT_AUTHORIZED_MESSAGE,
  USER_NOT_AUTHORIZED_CODE,
  USER_NOT_AUTHORIZED_PARAM,
  CHAT_NOT_FOUND,
  CHAT_NOT_FOUND_PARAM,
  CHAT_NOT_FOUND_MESSAGE,
  CHAT_NOT_FOUND_CODE,
} from '@talawa-api/constants';
import { MutationResolvers } from '../generatedTypes';

export const sendMessageToGroupChat: MutationResolvers['sendMessageToGroupChat'] =
  async (parent, args, context) => {
    const chat = await GroupChat.findById(args.chatId);
    if (!chat) {
      throw new NotFoundError(
        !IN_PRODUCTION
          ? CHAT_NOT_FOUND
          : requestContext.translate(CHAT_NOT_FOUND_MESSAGE),
        CHAT_NOT_FOUND_CODE,
        CHAT_NOT_FOUND_PARAM
      );
    }

    const sender = await userExists(context.userId);

    // ensure the user is a member of the group chat
    const userIsAMemberOfGroupChat = chat.users.filter(
      (user) => user.toString() === context.userId
    );
    if (!(userIsAMemberOfGroupChat.length > 0)) {
      throw new UnauthorizedError(
        !IN_PRODUCTION
          ? USER_NOT_AUTHORIZED
          : requestContext.translate(USER_NOT_AUTHORIZED_MESSAGE),
        USER_NOT_AUTHORIZED_CODE,
        USER_NOT_AUTHORIZED_PARAM
      );
    }

    const message = new GroupChatMessage({
      groupChatMessageBelongsTo: chat._doc,
      sender: sender._id,
      createdAt: new Date(),
      messageContent: args.messageContent,
    });

    await message.save();

    // add message to chat
    await GroupChat.updateOne(
      {
        _id: args.chatId,
      },
      {
        $set: {
          messages: [...chat._doc.messages, message],
        },
      }
    );

    //calls subscription
    context.pubsub.publish('MESSAGE_SENT_TO_GROUP_CHAT', {
      messageSentToGroupChat: {
        ...message._doc,
      },
    });

    return message._doc;
  };

export default sendMessageToGroupChat;
