import { User, Organization } from '@talawa-api/models';
import { MembershipRequestResolvers } from './generatedTypes';

export const MembershipRequest: MembershipRequestResolvers = {
  organization: async (parent) =>
    await Organization.findOne({ _id: parent.organization }),
  user: async (parent) => await User.findOne({ _id: parent.user }),
};

export default MembershipRequest;
