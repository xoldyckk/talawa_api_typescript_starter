import { User, Chat as MessageChat } from '@talawa-api/models';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const createMessageChat: MutationResolvers['createMessageChat'] = async (
  parent,
  args,
  context
) => {
  const user = await User.findOne({
    _id: args.data.receiver,
  });

  const senderUser = await User.findOne({
    _id: context.userId,
  });

  const isLangSame = user.appLanguageCode === senderUser.appLanguageCode;

  if (!user) {
    throw new NotFoundError(
      requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  let messageChat = new MessageChat({
    sender: context.userId,
    receiver: user.id,
    message: args.data.message,
    languageBarrier: !isLangSame,
  });

  messageChat = await messageChat.save();

  context.pubsub.publish('CHAT_CHANNEL', {
    directMessageChat: {
      ...messageChat._doc,
    },
  });

  return messageChat._doc;
};

export default createMessageChat;
