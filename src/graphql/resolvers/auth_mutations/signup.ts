import bcrypt from 'bcryptjs';
import { User, Organization } from '@talawa-api/models';
import { NotFoundError, ConflictError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import {
  createAccessToken,
  createRefreshToken,
  uploadImage,
} from '@talawa-api/utils';
import copyToClipboard from '../functions/copyToClipboard.js';
import { MutationResolvers } from '../generatedTypes';

export const signUp: MutationResolvers['signUp'] = async (
  parent,
  args,
  context,
  info
) => {
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

  // TODO: this check is to be removed
  let org;
  if (args.data.organizationUserBelongsToId) {
    org = await Organization.findOne({
      _id: args.data.organizationUserBelongsToId,
    });
    if (!org) {
      throw new NotFoundError(
        requestContext.translate('organization.notFound'),
        'organization.notFound',
        'organization'
      );
    }
  }

  const hashedPassword = await bcrypt.hash(args.data.password, 12);

  // Upload file
  let uploadImageObj;
  if (args.file) {
    uploadImageObj = await uploadImage(args.file, null);
  }

  let user = new User({
    ...args.data,
    organizationUserBelongsTo: org ? org : null,
    email: args.data.email.toLowerCase(), // ensure all emails are stored as lowercase to prevent duplicated due to comparison errors
    image: uploadImageObj
      ? uploadImageObj.imageAlreadyInDbPath
        ? uploadImageObj.imageAlreadyInDbPath
        : uploadImageObj.newImagePath
      : null,
    password: hashedPassword,
  });

  user = await user.save();
  const accessToken = await createAccessToken(user);
  const refreshToken = await createRefreshToken(user);

  copyToClipboard(`{
  "Authorization": "Bearer ${accessToken}"
}`);

  return {
    user: {
      ...user._doc,
      password: null,
    },
    accessToken,
    refreshToken,
  };
};

export default signUp;
