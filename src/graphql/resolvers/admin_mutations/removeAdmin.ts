import { User, Organization } from '@talawa-api/models';
import creatorCheck from '../functions/creatorCheck';
import { NotFoundError, UnauthorizedError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import {
  ORGANIZATION_NOT_FOUND,
  ORGANIZATION_NOT_FOUND_PARAM,
  IN_PRODUCTION,
  USER_NOT_FOUND,
  USER_NOT_FOUND_MESSAGE,
  USER_NOT_FOUND_PARAM,
  USER_NOT_FOUND_CODE,
  USER_NOT_AUTHORIZED,
  USER_NOT_AUTHORIZED_MESSAGE,
  USER_NOT_AUTHORIZED_CODE,
  USER_NOT_AUTHORIZED_PARAM,
  ORGANIZATION_NOT_FOUND_MESSAGE,
  ORGANIZATION_NOT_FOUND_CODE,
} from '@talawa-api/constants';
import { MutationResolvers } from '../generatedTypes';

export const removeAdmin: MutationResolvers['removeAdmin'] = async (
  parent,
  args,
  context
) => {
  // ensure organization exists
  const org = await Organization.findOne({ _id: args.data.organizationId });
  if (!org) {
    throw new NotFoundError(
      !IN_PRODUCTION
        ? ORGANIZATION_NOT_FOUND
        : requestContext.translate(ORGANIZATION_NOT_FOUND_MESSAGE),
      ORGANIZATION_NOT_FOUND_CODE,
      ORGANIZATION_NOT_FOUND_PARAM
    );
  }

  // ensure user exists
  const user = await User.findOne({ _id: args.data.userId });
  if (!user) {
    throw new NotFoundError(
      !IN_PRODUCTION
        ? USER_NOT_FOUND
        : requestContext.translate(USER_NOT_FOUND_MESSAGE),
      USER_NOT_FOUND_CODE,
      USER_NOT_FOUND_PARAM
    );
  }

  // ensure user is an admin
  const admin = org._doc.admins.filter((admin) => admin.toString() === user.id);
  if (admin.length === 0) {
    throw new UnauthorizedError(
      !IN_PRODUCTION
        ? USER_NOT_AUTHORIZED
        : requestContext.translate(USER_NOT_AUTHORIZED_MESSAGE),
      USER_NOT_AUTHORIZED_CODE,
      USER_NOT_AUTHORIZED_PARAM
    );
  }

  // ensure user trying to remove admin is the creator
  creatorCheck(context, org);

  // remove admin from organization
  org.overwrite({
    ...org._doc,
    admins: org._doc.admins.filter((admin) => admin.toString() !== user.id),
  });
  await org.save();

  // remove organization from the user's adminFor field
  user.overwrite({
    ...user._doc,
    adminFor: user._doc.adminFor.filter(
      (organization) => organization.toString() !== org.id
    ),
  });
  await user.save();

  // return user
  return {
    ...user.toObject(),
    password: null,
  };
};

export default removeAdmin;
