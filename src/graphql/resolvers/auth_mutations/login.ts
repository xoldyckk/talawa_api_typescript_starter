import bcrypt from 'bcryptjs';
import { User } from '@talawa-api/models';
import { createAccessToken, createRefreshToken } from '@talawa-api/utils';
import { NotFoundError, ValidationError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import copyToClipboard from '../functions/copyToClipboard';
import { MutationResolvers } from '../generatedTypes';

export const login: MutationResolvers['login'] = async (parent, args) => {
  const user = await User.findOne({ email: args.data.email.toLowerCase() });
  if (!user) {
    throw new NotFoundError(
      requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  const isEqual = await bcrypt.compare(args.data.password, user._doc.password);

  if (!isEqual) {
    throw new ValidationError(
      [
        {
          message: requestContext.translate('invalid.credentials'),
          code: 'invalid.credentials',
          param: 'credentials',
        },
      ],
      requestContext.translate('invalid.credentials')
    );
  }

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

export default login;
