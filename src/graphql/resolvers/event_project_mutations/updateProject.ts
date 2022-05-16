import { User, EventProject } from '@talawa-api/models';
import { NotFoundError, UnauthorizedError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';

export const updateEvent = async (parent, args, context) => {
  const user = await User.findOne({ _id: context.userId });

  if (!user) {
    throw new NotFoundError(
      process.env.NODE_ENV !== 'production'
        ? 'User not found'
        : requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  const eventProject = await EventProject.findOne({ _id: args.id });

  if (!eventProject) {
    throw new NotFoundError(
      process.env.NODE_ENV !== 'production'
        ? 'EventProject not found'
        : requestContext.translate('eventProject.notFound'),
      'eventProject.notFound',
      'eventProject'
    );
  }

  // toString() method converts mongodb's objectId to a javascript string for comparision
  if (eventProject.creator.toString() !== context.userId) {
    throw new UnauthorizedError(
      process.env.NODE_ENV !== 'production'
        ? 'User not authorized'
        : requestContext.translate('user.notAuthorized'),
      'user.notAuthorized',
      'userAuthorization'
    );
  }

  const newEventProject = await EventProject.findOneAndUpdate(
    { _id: args.id },
    { ...args.data },
    { new: true }
  );

  return newEventProject;
};

export default updateEvent;
