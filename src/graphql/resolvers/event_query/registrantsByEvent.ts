import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { Event } from '@talawa-api/models';
import {
  EVENT_NOT_FOUND,
  EVENT_NOT_FOUND_MESSAGE,
  EVENT_NOT_FOUND_PARAM,
  EVENT_NOT_FOUND_CODE,
  IN_PRODUCTION,
} from '@talawa-api/constants';
import { QueryResolvers } from '../generatedTypes';

export const registrantsByEvent: QueryResolvers['registrantsByEvent'] = async (
  parent,
  args
) => {
  const eventFound = await Event.findOne({
    _id: args.id,
    status: 'ACTIVE',
  }).populate('registrants.user');

  if (!eventFound) {
    throw new NotFoundError(
      !IN_PRODUCTION
        ? EVENT_NOT_FOUND
        : requestContext.translate(EVENT_NOT_FOUND_MESSAGE),
      EVENT_NOT_FOUND_CODE,
      EVENT_NOT_FOUND_PARAM
    );
  }

  // Return EventFound Registrants
  let registrants = [];
  if (eventFound.registrants.length > 0) {
    eventFound.registrants.map((registrant) => {
      if (registrant.status === 'ACTIVE') {
        registrants.push({
          ...registrant.user._doc,
          password: null,
        });
      }
    });
  }

  return registrants;
};

export default registrantsByEvent;
