import { User, DirectChatMessage, Organization } from '@talawa-api/models';
import { DirectChatResolvers } from './generatedTypes';

export const DirectChat: DirectChatResolvers = {
  users: async (parent) =>
    await User.find({
      _id: {
        $in: [...parent.users],
      },
    }),
  creator: async (parent) => await User.findById(parent.creator),
  messages: async (parent) =>
    DirectChatMessage.find({
      _id: {
        $in: [...parent.messages],
      },
    }),
  organization: async (parent) =>
    await Organization.findById(parent.organization),
};

export default DirectChat;
