import { Task } from '@talawa-api/models';
import { QueryResolvers } from '../generatedTypes';

export const tasksByUser: QueryResolvers['tasksByUser'] = async (
  parent,
  args
) => {
  var sort = {};
  var isSortingExecuted = args.orderBy !== null;

  //Sorting List
  if (isSortingExecuted) {
    if (args.orderBy === 'id_ASC') {
      sort = { _id: 1 };
    } else if (args.orderBy === 'id_DESC') {
      sort = { _id: -1 };
    } else if (args.orderBy === 'title_ASC') {
      sort = { title: 1 };
    } else if (args.orderBy === 'title_DESC') {
      sort = { title: -1 };
    } else if (args.orderBy === 'description_ASC') {
      sort = { description: 1 };
    } else if (args.orderBy === 'description_DESC') {
      sort = { description: -1 };
    } else if (args.orderBy === 'createdAt_ASC') {
      sort = { createdAt: 1 };
    } else if (args.orderBy === 'createdAt_DESC') {
      sort = { createdAt: -1 };
    } else if (args.orderBy === 'deadline_ASC') {
      sort = { deadline: 1 };
    } else {
      sort = { deadline: -1 };
    }
  }

  return await Task.find({ creator: args.id })
    .sort(sort)
    .populate('event')
    .populate('creator', '-password');
};

export default tasksByUser;
