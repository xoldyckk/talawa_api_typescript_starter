import { User } from '@talawa-api/models';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import {
  IN_PRODUCTION,
  USER_NOT_FOUND,
  USER_NOT_FOUND_MESSAGE,
  USER_NOT_FOUND_CODE,
  USER_NOT_FOUND_PARAM,
} from '@talawa-api/constants';
import { QueryResolvers } from '../generatedTypes';

export const userLanguage: QueryResolvers['userLanguage'] = async (
  parent,
  args
) => {
  const user = await User.findOne({
    _id: args.userId,
  });

  if (!user) {
    throw new NotFoundError(
      !IN_PRODUCTION
        ? USER_NOT_FOUND
        : requestContext.translate(USER_NOT_FOUND_MESSAGE),
      USER_NOT_FOUND_CODE,
      USER_NOT_FOUND_PARAM
    );
  }

  return user.appLanguageCode;
};

export default userLanguage;
