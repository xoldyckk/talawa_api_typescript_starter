import {
  IN_PRODUCTION,
  USER_NOT_FOUND,
  USER_NOT_FOUND_MESSAGE,
  USER_NOT_FOUND_CODE,
  USER_NOT_FOUND_PARAM,
} from '@talawa-api/constants';
import { NotFoundError } from '@talawa-api/errors';
import { User } from '@talawa-api/models';
import requestContext from '@talawa-api/request-context';

export const userExists = async (id: string) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NotFoundError(
      !IN_PRODUCTION
        ? USER_NOT_FOUND
        : requestContext.translate(USER_NOT_FOUND_MESSAGE),
      USER_NOT_FOUND_CODE,
      USER_NOT_FOUND_PARAM
    );
  }
  return user;
};

export default userExists;
