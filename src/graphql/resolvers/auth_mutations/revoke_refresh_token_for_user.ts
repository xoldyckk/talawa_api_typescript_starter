/* eslint-disable indent */
import { User } from '@talawa-api/models';
import { MutationResolvers } from '../generatedTypes';

export const revokeRefreshTokenForUser: MutationResolvers['revokeRefreshTokenForUser'] =
  async (parent, args) => {
    await User.findOneAndUpdate(
      { _id: args.userId },
      {
        $inc: {
          tokenVersion: 1,
        },
      },
      {
        new: true,
      }
    );
    return true;
  };

export default revokeRefreshTokenForUser;
