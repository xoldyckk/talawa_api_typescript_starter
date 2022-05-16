import { User, Event, Task } from '@talawa-api/models';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import {
  IN_PRODUCTION,
  USER_NOT_FOUND,
  USER_NOT_FOUND_MESSAGE,
  USER_NOT_FOUND_CODE,
  USER_NOT_FOUND_PARAM,
  EVENT_NOT_FOUND,
  EVENT_NOT_FOUND_MESSAGE,
  EVENT_NOT_FOUND_CODE,
  EVENT_NOT_FOUND_PARAM,
} from '@talawa-api/constants';
import { MutationResolvers } from '../generatedTypes';

export const createTask: MutationResolvers['createTask'] = async (
  parent,
  args,
  context
) => {
  // gets user in token - to be used later on
  const user = await User.findOne({ _id: context.userId });
  if (!user) {
    throw new NotFoundError(
      !IN_PRODUCTION
        ? USER_NOT_FOUND
        : requestContext.translate(USER_NOT_FOUND_MESSAGE),
      USER_NOT_FOUND_CODE,
      USER_NOT_FOUND_PARAM
    );
  }

  const eventFound = await Event.findOne({
    _id: args.eventId,
  });
  if (!eventFound) {
    throw new NotFoundError(
      !IN_PRODUCTION
        ? EVENT_NOT_FOUND
        : requestContext.translate(EVENT_NOT_FOUND_MESSAGE),
      EVENT_NOT_FOUND_CODE,
      EVENT_NOT_FOUND_PARAM
    );
  }

  const task = new Task({
    ...args.data,
    event: eventFound,
    creator: user,
  });
  await task.save();

  await Event.findOneAndUpdate(
    { _id: args.eventId },
    {
      $push: {
        tasks: task,
      },
    },
    { new: true }
  );
  return {
    ...task._doc,
  };
};

export default createTask;
