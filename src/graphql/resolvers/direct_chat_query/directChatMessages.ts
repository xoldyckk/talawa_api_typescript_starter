import { DirectChatMessage } from '@talawa-api/models';
import { QueryResolvers } from '../generatedTypes';

export const directChatMessages: QueryResolvers['directChatMessages'] =
  async () => {
    return await DirectChatMessage.find();
  };

export default directChatMessages;
