import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { Event } from '@talawa-api/models';
import { QueryResolvers } from '../generatedTypes';

export const event: QueryResolvers['event'] = async (parent, args) => {
  const eventFound = await Event.findOne({
    _id: args.id,
    status: 'ACTIVE',
  })
    .populate('creator', '-password')
    .populate('tasks')
    .populate('admins', '-password');

  if (!eventFound) {
    throw new NotFoundError(
      requestContext.translate('event.notFound'),
      'event.notFound',
      'event'
    );
  }

  return eventFound;
};

export default event;
