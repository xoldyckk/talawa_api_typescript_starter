import { User, Organization, MembershipRequest } from '@talawa-api/models';
import { NotFoundError, ConflictError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const sendMembershipRequest: MutationResolvers['sendMembershipRequest'] =
  async (parent, args, context) => {
    // ensure user exists
    const user = await User.findOne({ _id: context.userId });
    if (!user) {
      throw new NotFoundError(
        requestContext.translate('user.notFound'),
        'user.notFound',
        'user'
      );
    }

    // ensure organization exists
    const org = await Organization.findOne({ _id: args.organizationId });
    if (!org) {
      throw new NotFoundError(
        requestContext.translate('organization.notFound'),
        'organization.notFound',
        'organization'
      );
    }

    // create membership request
    const exists = await MembershipRequest.find({
      user: user.id,
      organization: org.id,
    });
    console.log(exists);
    if (exists.length > 0) {
      throw new ConflictError(
        requestContext.translate('membershipRequest.alreadyExists'),
        'membershipRequest.alreadyExists',
        'membershipRequest'
      );
    }

    let newMembershipRequest = new MembershipRequest({
      user,
      organization: org,
    });
    newMembershipRequest = await newMembershipRequest.save();

    // add membership request to organization
    await Organization.findOneAndUpdate(
      { _id: org._doc._id },
      {
        $set: {
          membershipRequests: [
            ...org._doc.membershipRequests,
            newMembershipRequest,
          ],
        },
      }
    );

    // add membership request to user
    await User.findOneAndUpdate(
      { _id: user._doc._id },
      {
        $set: {
          membershipRequests: [
            ...user._doc.membershipRequests,
            newMembershipRequest,
          ],
        },
      }
    );

    return newMembershipRequest._doc;
  };

export default sendMembershipRequest;
