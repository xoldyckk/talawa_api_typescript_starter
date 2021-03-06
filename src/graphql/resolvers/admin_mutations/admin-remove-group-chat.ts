import { User, Organization, GroupChat } from '@talawa-api/models';
import adminCheck from '../functions/adminCheck';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import {
  IN_PRODUCTION,
  USER_NOT_FOUND,
  USER_NOT_FOUND_MESSAGE,
  USER_NOT_FOUND_CODE,
  USER_NOT_FOUND_PARAM,
  ORGANIZATION_NOT_FOUND,
  ORGANIZATION_NOT_FOUND_MESSAGE,
  ORGANIZATION_NOT_FOUND_CODE,
  ORGANIZATION_NOT_FOUND_PARAM,
  CHAT_NOT_FOUND,
  CHAT_NOT_FOUND_PARAM,
  CHAT_NOT_FOUND_CODE,
  CHAT_NOT_FOUND_MESSAGE,
} from '@talawa-api/constants';
import { MutationResolvers } from '../generatedTypes';

export const adminRemoveGroupChat: MutationResolvers['adminRemoveGroup'] =
  async (parent, args, context) => {
    //find message
    let group = await GroupChat.findOne({ _id: args.groupId });

    if (!group) {
      throw new NotFoundError(
        !IN_PRODUCTION
          ? CHAT_NOT_FOUND
          : requestContext.translate(CHAT_NOT_FOUND_MESSAGE),
        CHAT_NOT_FOUND_CODE,
        CHAT_NOT_FOUND_PARAM
      );
    }

    //ensure organization exists
    let org = await Organization.findOne({ _id: group._doc.organization._id });
    if (!org) {
      throw new NotFoundError(
        !IN_PRODUCTION
          ? ORGANIZATION_NOT_FOUND
          : requestContext.translate(ORGANIZATION_NOT_FOUND_MESSAGE),
        ORGANIZATION_NOT_FOUND_CODE,
        ORGANIZATION_NOT_FOUND_PARAM
      );
    }

    //gets user in token - to be used later on
    let user = await User.findOne({ _id: context.userId });
    if (!user) {
      throw new NotFoundError(
        !IN_PRODUCTION
          ? USER_NOT_FOUND
          : requestContext.translate(USER_NOT_FOUND_MESSAGE),
        USER_NOT_FOUND_CODE,
        USER_NOT_FOUND_PARAM
      );
    }

    //ensure user is an admin
    adminCheck(context, org);

    //remove message from organization
    // org.overwrite({
    //   ...org._doc,
    //   messages: org._doc.posts.filter((message) => message != args.messageId),
    // });
    // await org.save();

    // //remove post from user
    // user.overwrite({
    //   ...user._doc,
    //   messages: user._doc.posts.filter((message) => message != args.messageId),
    // });
    // await user.save();

    //delete post
    await GroupChat.deleteOne({ _id: args.groupId });

    //return user
    return {
      ...group._doc,
    };
  };

export default adminRemoveGroupChat;
