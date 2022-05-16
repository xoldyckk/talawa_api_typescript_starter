import { User } from '@talawa-api/models';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const updateLanguage: MutationResolvers['updateLanguage'] = async (
  parent,
  args,
  context
) => {
  // gets user in token - to be used later on
  const userFound = await User.findOne({
    _id: context.userId,
  });
  if (!userFound) {
    throw new NotFoundError(
      process.env.NODE_ENV !== 'production'
        ? 'User not found'
        : requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  //UPDATE LANGUAGE
  userFound.overwrite({
    ...userFound._doc,
    appLanguageCode: args.languageCode,
  });

  await userFound.save();

  return userFound;
};

export default updateLanguage;
