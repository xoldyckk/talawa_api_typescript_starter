import { Group } from '@talawa-api/models';
import { QueryResolvers } from '../generatedTypes';

export const groups: QueryResolvers['groups'] = async () => {
  return await Group.find();
};

export default groups;
