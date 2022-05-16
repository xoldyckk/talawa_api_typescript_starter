/* eslint-disable no-useless-catch */
import { User } from '@talawa-api/models';
import { userExists, uploadImage } from '@talawa-api/utils';
import { ConflictError, NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const updateUserProfile: MutationResolvers['updateUserProfile'] = async (
  parent,
  args,
  context
) => {
  try {
    //gets user in token - to be used later on
    let userFound = await userExists(context.userId);
    if (!userFound) {
      throw new NotFoundError(
        requestContext.translate('user.notFound'),
        'user.notFound',
        'user'
      );
    }
    if (args.data.email !== undefined) {
      const emailTaken = await User.findOne({
        email: args.data.email.toLowerCase(),
      });

      if (emailTaken) {
        throw new ConflictError(
          requestContext.translate('email.alreadyExists'),
          'email.alreadyExists',
          'email'
        );
      }
    }

    // Upload file
    let uploadImageObj;
    if (args.file) {
      uploadImageObj = await uploadImage(args.file, null);
    }

    if (uploadImageObj) {
      //UPDATE USER
      userFound.overwrite({
        ...userFound._doc,
        ...args.data,
        image: uploadImageObj.imageAlreadyInDbPath
          ? uploadImageObj.imageAlreadyInDbPath
          : uploadImageObj.newImagePath,
      });
    } else {
      //UPDATE USER
      userFound.overwrite({
        ...userFound._doc,
        ...args.data,
      });
    }

    await userFound.save();
    return userFound;
  } catch (error) {
    throw error;
  }
};

export default updateUserProfile;
