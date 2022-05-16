import { DirectChat, DirectChatMessage } from '@talawa-api/models';
import { userExists } from '@talawa-api/utils';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import {
  IN_PRODUCTION,
  CHAT_NOT_FOUND,
  CHAT_NOT_FOUND_MESSAGE,
  CHAT_NOT_FOUND_CODE,
  CHAT_NOT_FOUND_PARAM,
} from '@talawa-api/constants';
import { MutationResolvers } from '../generatedTypes';

export const sendMessageToDirectChat: MutationResolvers['sendMessageToDirectChat'] =
  async (parent, args, context) => {
    const chat = await DirectChat.findById(args.chatId);
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

    const receiver = chat.users.filter((u) => u.toString() !== sender.id);

    const message = new DirectChatMessage({
      directChatMessageBelongsTo: chat._doc,
      sender: sender._id,
      receiver: receiver,
      createdAt: new Date(),
      messageContent: args.messageContent,
    });

    await message.save();

    // add message to chat
    await DirectChat.updateOne(
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
    context.pubsub.publish('MESSAGE_SENT_TO_DIRECT_CHAT', {
      messageSentToDirectChat: message._doc,
    });

    return message._doc;
  };

export default sendMessageToDirectChat;
