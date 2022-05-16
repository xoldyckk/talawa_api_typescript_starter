import { DirectChat, DirectChatMessage } from '@talawa-api/models';
import adminCheck from '../functions/adminCheck';
import { organizationExists } from '@talawa-api/utils';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

// admins of the organization can remove chats -- may change in the future

export const removeDirectChat: MutationResolvers['removeDirectChat'] = async (
  parent,
  args,
  context
) => {
  const org = await organizationExists(args.organizationId);

  const chat = await DirectChat.findById(args.chatId);
  if (!chat) {
    throw new NotFoundError(
      requestContext.translate('chat.notFound'),
      'chat.notFound',
      'chat'
    );
  }

  adminCheck(context, org);

  // delete all messages in the chat
  await DirectChatMessage.deleteMany({
    _id: {
      $in: [...chat.messages],
    },
  });

  await DirectChat.deleteOne({ _id: args.chatId });

  return chat;
};

export default removeDirectChat;
