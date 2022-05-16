import { User, Task } from '@talawa-api/models';
import { NotFoundError, UnauthorizedError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const updateTask: MutationResolvers['updateTask'] = async (
  parent,
  args,
  context
) => {
  const user = await User.findOne({ _id: context.userId });
  if (!user) {
    throw new NotFoundError(
      requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  const task = await Task.findOne({ _id: args.id });
  if (!task) {
    throw new NotFoundError(
      requestContext.translate('task.notFound'),
      'task.notFound',
      'task'
    );
  }

  if (!(task.creator !== context.userId)) {
    throw new UnauthorizedError(
      requestContext.translate('user.notAuthorized'),
      'user.notAuthorized',
      'userAuthorization'
    );
  }

  const newTask = await Task.findOneAndUpdate(
    { _id: args.id },
    { ...args.data },
    { new: true }
  );
  return newTask;
};

export default updateTask;
