import { User } from '@talawa-api/models';
import { deleteImage } from '@talawa-api/utils';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const removeUserImage: MutationResolvers['removeUserImage'] = async (
  parent,
  args,
  context
) => {
  const user = await User.findById(context.userId);
  if (!user) {
    throw new NotFoundError(
      requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  if (!user.image) {
    throw new NotFoundError(
      requestContext.translate('user.profileImage.notFound'),
      'user.profileImage.notFound',
      'userProfileImage'
    );
  }

  await deleteImage(user.image);

  const newUser = await User.findOneAndUpdate(
    {
      _id: user.id,
    },
    {
      $set: {
        image: null,
      },
    },
    {
      new: true,
    }
  );
  return newUser;
};

export default removeUserImage;
