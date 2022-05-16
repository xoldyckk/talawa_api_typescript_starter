import { User, DirectChat } from '@talawa-api/models';
import { DirectChatMessageResolvers } from './generatedTypes';

export const DirectChatMessage: DirectChatMessageResolvers = {
  directChatMessageBelongsTo: async (parent) => {
    return await DirectChat.findById(parent.directChatMessageBelongsTo);
  },
  sender: async (parent) => {
    return await User.findById(parent.sender);
  },
  receiver: async (parent) => {
    return await User.findById(parent.receiver);
  },
};

export default DirectChatMessage;
