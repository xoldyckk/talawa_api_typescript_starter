import adminCheck from '../functions/adminCheck';
import { userExists, organizationExists } from '@talawa-api/utils';
import { UnauthorizedError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import {
  IN_PRODUCTION,
  USER_NOT_AUTHORIZED,
  USER_NOT_AUTHORIZED_MESSAGE,
  USER_NOT_AUTHORIZED_CODE,
  USER_NOT_AUTHORIZED_PARAM,
} from '@talawa-api/constants';
import { MutationResolvers } from '../generatedTypes';

export const unblockUser: MutationResolvers['unblockUser'] = async (
  parent,
  args,
  context
) => {
  // ensure org exists
  const org = await organizationExists(args.organizationId);

  // ensure user exists
  const user = await userExists(args.userId);

  // ensure user is admin
  adminCheck(context, org);

  // ensure user is blocked
  const blocked = org._doc.blockedUsers.filter(
    (blockedUser) => blockedUser.toString() === user.id
  );
  if (!blocked[0]) {
    throw new UnauthorizedError(
      !IN_PRODUCTION
        ? USER_NOT_AUTHORIZED
        : requestContext.translate(USER_NOT_AUTHORIZED_MESSAGE),
      USER_NOT_AUTHORIZED_CODE,
      USER_NOT_AUTHORIZED_PARAM
    );
  }

  // remove user from the  blockedUsers array inside the organization record.
  org.overwrite({
    ...org._doc,
    blockedUsers: org._doc.blockedUsers.filter(
      (blockedUser) => blockedUser.toString() !== user.id
    ),
  });
  await org.save();

  // remove the organization from the organizationsBlockedBy array inside the user record.
  user.overwrite({
    ...user._doc,
    organizationsBlockedBy: user._doc.organizationsBlockedBy.filter(
      (organization) => organization.toString() !== org.id
    ),
  });
  await user.save();

  return {
    ...user._doc,
    password: null,
  };
};

export default unblockUser;
