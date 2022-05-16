import { User, GroupChat } from '@talawa-api/models';
import { GroupChatMessageResolvers } from './generatedTypes';

export const GroupChatMessage: GroupChatMessageResolvers = {
  groupChatMessageBelongsTo: async (parent) => {
    return await GroupChat.findById(parent.groupChatMessageBelongsTo);
  },
  sender: async (parent) => {
    return await User.findById(parent.sender);
  },
};

export default GroupChatMessage;
