import { GroupChat, GroupChatMessage } from '@talawa-api/models';
import adminCheck from '../functions/adminCheck';
import { organizationExists } from '@talawa-api/utils';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

// admins of the organization can remove chats -- may change in the future

export const removeGroupChat: MutationResolvers['removeGroupChat'] = async (
  parent,
  args,
  context
) => {
  const chat = await GroupChat.findById(args.chatId);
  if (!chat) {
    throw new NotFoundError(
      requestContext.translate('chat.notFound'),
      'chat.notFound',
      'chat'
    );
  }

  const org = await organizationExists(chat.organization);

  adminCheck(context, org);

  // delete all messages in the chat
  await GroupChatMessage.deleteMany({
    _id: {
      $in: [...chat.messages],
    },
  });

  await GroupChat.deleteOne({ _id: args.chatId });

  return chat;
};

export default removeGroupChat;
