import { User, Post } from '@talawa-api/models';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const likePost: MutationResolvers['likePost'] = async (
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

  const post = await Post.findOne({ _id: args.id });
  if (!post) {
    throw new NotFoundError(
      requestContext.translate('post.notFound'),
      'post.notFound',
      'post'
    );
  }

  if (!post.likedBy.includes(context.userId)) {
    const newPost = await Post.findOneAndUpdate(
      { _id: args.id },
      {
        $push: {
          likedBy: user,
        },
        $inc: {
          likeCount: 1,
        },
      },
      { new: true }
    );
    return newPost;
  }
  return post;
};

export default likePost;
