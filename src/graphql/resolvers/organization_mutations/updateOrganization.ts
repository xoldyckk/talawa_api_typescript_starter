import { Organization } from '@talawa-api/models';
import adminCheck from '../functions/adminCheck';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import {
  IN_PRODUCTION,
  ORGANIZATION_NOT_FOUND,
  ORGANIZATION_NOT_FOUND_MESSAGE,
  ORGANIZATION_NOT_FOUND_CODE,
  ORGANIZATION_NOT_FOUND_PARAM,
} from '@talawa-api/constants';
import { MutationResolvers } from '../generatedTypes';

export const updateOrganization: MutationResolvers['updateOrganization'] =
  async (parent, args, context) => {
    //checks to see if organization exists
    let org = await Organization.findOne({ _id: args.id });
    if (!org) {
      throw new NotFoundError(
        !IN_PRODUCTION
          ? ORGANIZATION_NOT_FOUND
          : requestContext.translate(ORGANIZATION_NOT_FOUND_MESSAGE),
        ORGANIZATION_NOT_FOUND_CODE,
        ORGANIZATION_NOT_FOUND_PARAM
      );
    }

    //check if the user is an admin
    adminCheck(context, org);

    //UPDATE ORGANIZATION
    org.overwrite({
      ...org._doc,
      ...args.data,
    });
    await org.save();

    return org;
  };

export default updateOrganization;
