/* eslint-disable eqeqeq */
import { withFilter } from 'apollo-server-express';
import { GroupChat } from '@talawa-api/models';
import { SubscriptionResolvers } from './generatedTypes';

const MESSAGE_SENT_TO_DIRECT_CHAT = 'MESSAGE_SENT_TO_DIRECT_CHAT';
const MESSAGE_SENT_TO_GROUP_CHAT = 'MESSAGE_SENT_TO_GROUP_CHAT';
const CHAT_CHANNEL = 'CHAT_CHANNEL';

export const Subscription: SubscriptionResolvers = {
  messageSentToDirectChat: {
    subscribe: withFilter(
      (parent, args, { pubsub }) =>
        pubsub.asyncIterator([MESSAGE_SENT_TO_DIRECT_CHAT]),
      (payload, variables, context) => {
        const { currentUserId } = context.context;
        return (
          currentUserId == payload.messageSentToDirectChat.receiver ||
          currentUserId == payload.messageSentToDirectChat.sender
        );
      }
    ),
  },
  messageSentToGroupChat: {
    // Show All messages sent to group chats the user belongs to but he didnt send ie the current user did not send the message
    subscribe: withFilter(
      (parent, args, context) =>
        context.pubsub.asyncIterator([MESSAGE_SENT_TO_GROUP_CHAT]),
      async (payload, variables, context) => {
        const { currentUserId } = context.context;
        const groupChatId =
          payload.messageSentToGroupChat.groupChatMessageBelongsTo;

        const groupChat = await GroupChat.findById(groupChatId);
        const userIsInGroupChat = groupChat.users.includes(currentUserId);
        return userIsInGroupChat;
      }
    ),
  },
  directMessageChat: {
    subscribe: withFilter(
      (parent, args, context) => context.pubsub.asyncIterator(CHAT_CHANNEL),
      (payload) => {
        const chat = payload.directMessageChat;
        console.log(chat);
        return chat;
      }
    ),
  },
};

export default Subscription;
