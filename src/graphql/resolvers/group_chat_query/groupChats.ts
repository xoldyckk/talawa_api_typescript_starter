import { GroupChat } from '@talawa-api/models';
import { QueryResolvers } from '../generatedTypes';

export const groupChats: QueryResolvers['groupChats'] = async () => {
  return await GroupChat.find();
};

export default groupChats;
