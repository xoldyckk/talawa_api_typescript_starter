import { User, GroupChatMessage, Organization } from '@talawa-api/models';
import { GroupChatResolvers } from './generatedTypes';

export const GroupChat: GroupChatResolvers = {
  users: async (parent) =>
    await User.find({
      _id: {
        $in: [...parent.users],
      },
    }),
  creator: async (parent) => await User.findById(parent.creator),
  messages: async (parent) =>
    GroupChatMessage.find({
      _id: {
        $in: [...parent.messages],
      },
    }),
  organization: async (parent) =>
    await Organization.findById(parent.organization),
};

export default GroupChat;
