import { GroupChatMessage } from '@talawa-api/models';
import { QueryResolvers } from '../generatedTypes';

export const groupChatMessages: QueryResolvers['groupChatMessages'] =
  async () => {
    return await GroupChatMessage.find();
  };

export default groupChatMessages;
