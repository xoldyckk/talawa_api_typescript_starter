import { User, Organization, MembershipRequest } from '@talawa-api/models';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';
const adminCheck = require('../functions/adminCheck');

export const rejectMembershipRequest: MutationResolvers['rejectMembershipRequest'] =
  async (parent, args, context) => {
    //ensure membership request exists
    const membershipRequest = await MembershipRequest.findOne({
      _id: args.membershipRequestId,
    });
    if (!membershipRequest) {
      throw new NotFoundError(
        requestContext.translate('membershipRequest.notFound'),
        'membershipRequest.notFound',
        'membershipRequest'
      );
    }

    //ensure org exists
    let org = await Organization.findOne({
      _id: membershipRequest.organization,
    });
    if (!org) {
      throw new NotFoundError(
        requestContext.translate('organization.notFound'),
        'organization.notFound',
        'organization'
      );
    }

    const user = await User.findOne({
      _id: membershipRequest.user,
    });
    if (!user) {
      throw new NotFoundError(
        requestContext.translate('user.notFound'),
        'user.notFound',
        'user'
      );
    }

    //ensure user is admin
    adminCheck(context, org);

    //delete membership request
    await MembershipRequest.deleteOne({
      _id: args.membershipRequestId,
    });

    //remove membership request from organization
    org.overwrite({
      ...org._doc,
      membershipRequests: org._doc.membershipRequests.filter(
        (request) => request._id !== membershipRequest.id
      ),
    });

    await org.save();

    //remove membership request from user
    user.overwrite({
      ...user._doc,
      membershipRequests: user._doc.membershipRequests.filter(
        (request) => request._id !== membershipRequest.id
      ),
    });

    await user.save();

    //return membershipship request
    return membershipRequest._doc;
  };

export default rejectMembershipRequest;
