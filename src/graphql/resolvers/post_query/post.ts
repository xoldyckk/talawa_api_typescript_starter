import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { Post } from '@talawa-api/models';
import { QueryResolvers } from '../generatedTypes';

export const post: QueryResolvers['post'] = async (parent, args) => {
  const postFound = await Post.findOne({
    _id: args.id,
  })
    .populate('organization')
    .populate({
      path: 'comments',
      populate: {
        path: 'creator',
      },
    })
    .populate('likedBy')
    .populate('creator', '-password');
  if (!postFound) {
    throw new NotFoundError(
      process.env.NODE_ENV !== 'production'
        ? 'Post not found'
        : requestContext.translate('post.notFound'),
      'post.notFound',
      'post'
    );
  }
  postFound.likeCount = postFound.likedBy.length || 0;
  postFound.commentCount = postFound.comments.length || 0;
  return postFound;
};

export default post;
