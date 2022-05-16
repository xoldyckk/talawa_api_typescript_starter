import { User } from '@talawa-api/models';
import { uploadImage } from '@talawa-api/utils';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const addUserImage: MutationResolvers['addUserImage'] = async (
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

  const uploadedImage = await uploadImage(args.file, user.image);

  return await User.findOneAndUpdate(
    { _id: user.id },
    {
      $set: {
        image: uploadedImage.imageAlreadyInDbPath
          ? uploadedImage.imageAlreadyInDbPath
          : uploadedImage.newImagePath,
      },
    },
    {
      new: true,
    }
  );
};

export default addUserImage;
