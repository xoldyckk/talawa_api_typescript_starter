import { DirectChat } from '@talawa-api/models';
import { QueryResolvers } from '../generatedTypes';

export const directChats: QueryResolvers['directChats'] = async () => {
  return await DirectChat.find();
};

export default directChats;
