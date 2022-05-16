import { User, Post, Comment } from '@talawa-api/models';
import { NotFoundError, UnauthorizedError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const removeComment: MutationResolvers['removeComment'] = async (
  parent,
  args,
  context
) => {
  const user = await User.findOne({ _id: context.userId });
  if (!user) {
    throw new NotFoundError(
      requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  const comment = await Comment.findOne({ _id: args.id });
  if (!comment) {
    throw new NotFoundError(
      requestContext.translate('comment.notFound'),
      'comment.notFound',
      'comment'
    );
  }

  if (!(comment.creator !== context.userId)) {
    throw new UnauthorizedError(
      requestContext.translate('user.notAuthorized'),
      'user.notAuthorized',
      'userAuthorization'
    );
  }

  await Post.updateOne(
    { _id: comment.post },
    {
      $pull: {
        comments: args.id,
      },
      $inc: {
        commentCount: -1,
      },
    }
  );

  await Comment.deleteOne({ _id: args.id });
  return comment;
};

export default removeComment;
