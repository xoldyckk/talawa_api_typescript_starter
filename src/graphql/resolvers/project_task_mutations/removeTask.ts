import { User, Event, Task } from '@talawa-api/models';
import { NotFoundError, UnauthorizedError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const removeTask: MutationResolvers['removeTask'] = async (
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

  const foundTask = await Task.findOne({ _id: args.id });
  if (!foundTask) {
    throw new NotFoundError(
      requestContext.translate('task.notFound'),
      'task.notFound',
      'task'
    );
  }

  if (!(foundTask.creator !== context.userId)) {
    throw new UnauthorizedError(
      requestContext.translate('user.notAuthorized'),
      'user.notAuthorized',
      'userAuthorization'
    );
  }

  await Event.updateMany(
    { id: foundTask.event },
    {
      $pull: {
        tasks: args.id,
      },
    }
  );

  await Task.deleteOne({ _id: args.id });
  return foundTask;
};

export default removeTask;
