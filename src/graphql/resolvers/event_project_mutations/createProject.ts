import { User, Event, EventProject } from '@talawa-api/models';
import { NotFoundError, UnauthorizedError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';

export const createEventProject = async (parent, args, context) => {
  // gets user in token - to be used later on
  const userFound = await User.findOne({ _id: context.userId });
  if (!userFound) {
    throw new NotFoundError(
      process.env.NODE_ENV !== 'production'
        ? 'User not found'
        : requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  const eventFound = await Event.findOne({ _id: args.data.eventId });
  if (!eventFound) {
    throw new NotFoundError(
      process.env.NODE_ENV !== 'production'
        ? 'Event not found'
        : requestContext.translate('event.notFound'),
      'event.notFound',
      'event'
    );
  }

  if (!eventFound.admins.includes(context.userId)) {
    throw new UnauthorizedError(
      process.env.NODE_ENV !== 'production'
        ? 'User not Authorized'
        : requestContext.translate('user.notAuthorized'),
      'user.notAuthorized',
      'userAuthorization'
    );
  }

  const newEventProject = new EventProject({
    title: args.data.title,
    description: args.data.description,
    event: eventFound,
    creator: userFound,
  });

  await newEventProject.save();

  return {
    ...newEventProject._doc,
  };
};

export default createEventProject;
