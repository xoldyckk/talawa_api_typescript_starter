import { User, GroupChat } from '@talawa-api/models';
import adminCheck from '../functions/adminCheck';
import { organizationExists } from '@talawa-api/utils';
import { NotFoundError, ConflictError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import {
  IN_PRODUCTION,
  CHAT_NOT_FOUND,
  CHAT_NOT_FOUND_MESSAGE,
  CHAT_NOT_FOUND_CODE,
  CHAT_NOT_FOUND_PARAM,
  USER_ALREADY_MEMBER,
  USER_ALREADY_MEMBER_CODE,
  USER_ALREADY_MEMBER_MESSAGE,
  USER_ALREADY_MEMBER_PARAM,
} from '@talawa-api/constants';
import { MutationResolvers } from '../generatedTypes';

export const addUserToGroupChat: MutationResolvers['addUserToGroupChat'] =
  async (parent, args, context) => {
    let chat = await GroupChat.findById(args.chatId);
    if (!chat) {
      throw new NotFoundError(
        !IN_PRODUCTION
          ? CHAT_NOT_FOUND
          : requestContext.translate(CHAT_NOT_FOUND_MESSAGE),
        CHAT_NOT_FOUND_CODE,
        CHAT_NOT_FOUND_PARAM
      );
    }

    const org = await organizationExists(chat.organization);

    adminCheck(context, org); // only an admin can add new users to the group chat -- may change in the future

    const userBeingAdded = await User.findById(args.userId);

    // ensure user isnt already a member
    const userAlreadyAMember = chat._doc.users.filter(
      (user) => user.toString() === args.userId.toString()
    );
    if (userAlreadyAMember.length > 0) {
      throw new ConflictError(
        !IN_PRODUCTION
          ? USER_ALREADY_MEMBER
          : requestContext.translate(USER_ALREADY_MEMBER_MESSAGE),
        USER_ALREADY_MEMBER_CODE,
        USER_ALREADY_MEMBER_PARAM
      );
    }

    return await GroupChat.findOneAndUpdate(
      { _id: args.chatId },
      {
        $set: {
          users: [...chat._doc.users, userBeingAdded],
        },
      },
      {
        new: true,
      }
    );
  };

export default addUserToGroupChat;
